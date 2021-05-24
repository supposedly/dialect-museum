/* eslint-disable max-classes-per-file */
const symbols = require(`../symbols`);
const {type: objType} = require(`../objs`);
const {fenum} = require(`../enums`);

const _ = {
  h: `h`,
  2: `2`,
  7: `7`,
  3: `3`,
  5: `5`,
  gh: `9`,
  q: `q`,
  k: `k`,
  g: `g`,
  y: `y`,
  sh: `x`,
  j: `j`,
  r: `r`,
  l: `l`,
  s: `s`,
  z: `z`,
  n: `n`,
  t: `t`,
  d: `d`,
  th: `8`,
  dh: `6`,
  f: `f`,
  v: `v`,
  w: `w`,
  m: `m`,
  b: `b`,
  p: `p`,

  a: `a`,
  aa: `A`,
  AA: `@`,  // lowered aa
  ae: `&`,  // foreign ae
  laxI: `1`,
  i: `i`,
  ii: `I`,
  laxU: `0`,
  u: `u`,
  uu: `U`,
  e: `e`,
  ee: `E`,
  o: `o`,
  oo: `O`,
  ay: `Y`,
  aw: `W`,

  _: `_`,  // no schwa
  Schwa: `'`,
  c: `c`,
  FemPlural: `C`,
  Dual: `=`,
  Plural: `+`,
  French: `N`,  // iunno about this one
  Of: `-`,
  Object: `.`,
  PseudoSubject: `~`,
  Dative: `|`,

  // 3fs: ya ha etc ??
};

// fill an alphabet out with default values n stuff
function makeAlphabet(alphabet) {
  return alphabet;
}

class Transformer {
  constructor(alphabet) {
    this.alphabet = makeAlphabet(alphabet);
  }

  get(keys) {
    let obj = this.alphabet;
    // ugly loop, have to avoid for..of bc of lint reasons that i don't understand xd
    // at least it's fast tho
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (obj[key]) {
        obj = obj[key];
      } else {
        obj = obj.default;
        break;
      }
    }
  }
}

const subAlphabets = Object.fromKeys(
  Object.values(objType).map(
    type => [type, Object.values(symbols.alphabet).filter(v => v.type === type)]
  )
);

class Not {
  constructor(value) {
    this.value = value;
  }

  matches(other) {
    // eslint-disable-next-line no-use-before-define
    if (this.value instanceof Or || this.value instanceof Not) {
      return this.value.matches(other);
    }
    return this.value !== other;
  }
}

class Or {
  constructor(...values) {
    this.values = values;
  }

  matches(other) {
    return this.values.some(value => {
      if (value instanceof Not || value instanceof Or) {
        return value.matches(other);
      }
      return value === other;
    });
  }
}

class Props {
  constructor(...objs) {
    if (objs === undefined || objs === null) {
      objs = [];
    }
    this.objs = objs.map(obj => {
      const objCopy = {...obj};
      Object.entries(objCopy).forEach(([k, v]) => {
        if (
          !(v instanceof Props || v instanceof Not || v instanceof Or)
          && v instanceof Object
          && !Array.isArray(v)
        ) {
          objCopy[k] = new Props(v);
        }
      });
      return objCopy;
    });
    this.empty = this.objs.length === 0;
  }

  matches(other) {
    if (this.empty) {
      return true;
    }
    return this.objs.some(
      obj => Object.entries(obj).every(([k, v]) => {
        if (Object.prototype.hasOwnProperty.call(other, k)) {
          if (v instanceof Props || v instanceof Not || v instanceof Or) {
            return v.matches(other[k]);
          }
          return v === other[k];
        }
        return false;
      })
    );
  }

  or(other) {
    return new Props(...this.objs, ...other.objs);
  }
}

const consonantPred = new Props({type: objType.consonant});
const vowelPred = new Props({type: objType.vowel}).or({type: objType.suffix, meta: {t: false}, value: `fem`});

const depType = fenum([
  `type`,
  `meta`,
  `wordType`,
  `wordMeta`,
  `word`,
  `prevConsonant`,
  `nextConsonant`,
  `prevVowel`,
  `nextVowel`,
]);

function extractDeps(arrowFunc) {
  const [s] = String(arrowFunc).split(`=>`, 1);
  return [...s.matchAll(/(\w+)(?:\s*:\s*\w+)?/g)].map(match => match[1]);
}

class ID {
  constructor(word, sylIdx, valIdx) {
    this.word = word;
    this.sylIdx = sylIdx === null ? word.length - 1 : sylIdx;
    this.syllable = this.word[this.sylIdx];
    this.valIdx = valIdx === null ? this.syllable.length - 1 : valIdx;
    this.value = this.syllable[this.valIdx];
  }

  toString() {
    // idx
    return `${this.sylIdx},${this.segIdx}`;
  }

  of(otherWord) {
    return new ID(otherWord, this.sylIdx, this.valIdx);
  }

  at(newSyl, newSeg) {
    return new ID(this.word, newSyl, newSeg);
  }
}

function mapWord(word) {
  const segMap = {};
  word.value.forEach((syllable, sylIdx) => {
    syllable.value.forEach(({value: segment}, segIdx) => {
      if (Array.isArray(segMap[segment])) {
        segMap[segment].push(new ID(word.value, sylIdx, segIdx));
      } else {
        segMap[segment] = [new ID(word.value, sylIdx, segIdx)];
      }
    });
  });
  return segMap;
}

class Cap {
  constructor(word) {
    this.word = {...word};
    this.wordMap = mapWord(this.word.value);
    this.trackers = this.word.map(syllable => Array.from(
      {length: syllable.value.length},
      () => ({
        visible: true,
        environment: null,
        dependents: {},
        currentChoiceIndices: [],
        choices: [],
      }),
    ));
  }

  searchSegmentRight(id, props) {
    const syllable = id.syllable.value;

    for (let i = id.valIdx - 1; i >= 0; i -= 1) {
      if (props.matches(syllable[i])) {
        /* return syllable[i]; */
        return id.at(id.sylIdx, i);
      }
    }
    if (id.sylIdx > 0) {
      return this.searchSegmentRight(id.at(id.sylIdx - 1, null), props);
    }
    return null;
  }

  searchSegmentLeft(id, props) {
    const syllable = id.syllable.value;
    for (let i = id.valIdx + 1; i < syllable.length; i += 1) {
      if (props.matches(syllable[i])) {
        /* return syllable[i]; */
        return id.at(id.sylIdx, i);
      }
    }
    if (id.sylIdx < this.word.value.length - 1) {
      return this.searchSegmentLeft(id.at(id.sylIdx + 1, 0), props);
    }
    return null;
  }

  depGetter(id) {
    return key => {
      switch (key) {
        case depType.type:
          return id.value.type;
        case depType.meta:
          return id.value.meta;
        case depType.wordType:
          return id.word.type;
        case depType.wordMeta:
          return id.word.meta;
        case depType.word:
          return id.word.value;
        case depType.prevConsonant:
          return this.searchSegmentRight(id, consonantPred);
        case depType.nextConsonant:
          return this.searchSegmentLeft(id, consonantPred);
        case depType.prevVowel:
          return this.searchSegmentRight(id, vowelPred);
        case depType.nextVowel:
          return this.searchSegmentRight(id, vowelPred);
        default:
          throw new Error(`Unknown dependency: ${key} (enum value ${depType.keys[key]})`);
      }
    };
  }

  updateEnv(
    id,
    dep
  ) {
    const tracker = id.of(this.trackers);
    if (tracker.environment === null) {
      tracker.environment = {};
    }

    const getDependency = this.depGetter(id);
    dep.forEach(key => {
      if (tracker.environment[key] === undefined) {
        const dependency = getDependency(key);
        tracker.environment[key] = dependency;
        // XXX: should this be buried down here???
        // (the part that assigns dependents)
        if (dependency instanceof ID) {
          // = true bc it has to be an object instead of a set due to
          // sets not allowing you to customize equality
          // (as an object it instead takes advantage of toString() which... meh)
          dependency.of(this.trackers).value.dependents[dependency] = true;
        }
      }
    });

    return tracker.environment;
  }

  wrap(filter, results) {
    if (filter) {
      const filterDeps = extractDeps(filter);
      // filter based on calling the filter function on the environment it requests
      results = results.filter(id => filter(this.updateEnv(id, filterDeps)));
    }
    if (!results || results.length === 0) {
      return () => {};
    }
    return handler => {
      const handlerDeps = extractDeps(handler);
      results.forEach(id => {
        const tracker = id.of(this.trackers).value;
        tracker.choices.push(handler(this.updateEnv(id, handlerDeps)));
        tracker.currentChoiceIndices.push(0);
      });
    };
  }

  just(obj, filter) {
    return this.wrap(filter, this.wordMap[obj.value]);
  }

  segment(props, filter) {
    props = props instanceof Props ? props : new Props(props);
    return this.wrap(
      filter,
      Object.values(this.wordMap)
        .map(indices => indices.filter(id => props.matches(id.value)))
        .flat()
    );
  }

  segmentOfType(type, props, filter) {
    props = props instanceof Props ? props : new Props(props);
    // don't think i'll allow type or value to be set
    const {meta: {intrinsic, ...rawMeta}} = props.obj;
    const meta = new Props(rawMeta);
    const searchSpace = props && intrinsic
      ? subAlphabets[type].filter(c => intrinsic.matches(c.meta.intrinsic))
      : subAlphabets[type];
    return this.wrap(
      filter,
      searchSpace
        .map(c => this.wordMap[c])
        .map(indices => indices.filter(
          id => meta.matches(id.value.meta)
        ))
        .flat()
    );
  }

  consonant(props, filter) {
    return this.segmentOfType(objType.consonant, props, filter);
  }

  vowel(props, filter) {
    return this.segmentOfType(objType.vowel, props, filter);
  }

  epenthetic(props, filter) {
    return this.segmentOfType(objType.epenthetic, props, filter);
  }

  suffix(props, filter) {
    return this.segmentOfType(objType.suffix, props, filter);
  }
}

const rules = [
  [_.c, (abc, ctx, {previousVowel, previousConsonant}) => {
    if (ctx.femA) {
      return [abc.c.low];
    }
    if (previousConsonant.value === `r` && previousVowel.meta.intrinsic.ly.high && !previousVowel.meta.intrinsic.ly.rounded) {
      return [abc.c.high];
    }
    if (previousConsonant.meta.intrinsic.ly.emphatic || previousConsonant.value === `r`) {
      // maybe emphatics can sometimes have -e idk
      return [abc.c.low];
    }
    if (ctx.type === `participle`) {
      return [abc.c.high, abc.c.low];
    }
    return [abc.c.high];
  }],
  [_.i, (abc, ctx, {previousConsonant, nextConsonant, codaConsonant}) => {
    // fuck this makes no sense
  }]
];

module.exports = {
  rules,
};
