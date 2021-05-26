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

function mapWord(word) {
  const segMap = {};
  word.value.forEach(({value: segment}, idx) => {
    if (segMap[segment] instanceof Set) {
      segMap[segment].add(idx);
    } else {
      segMap[segment] = new Set([idx]);
    }
  });
  return segMap;
}

class Cap {
  constructor(word) {
    this.word = {...word};
    this.wordMap = mapWord(this.word.value);
    this.trackers = this.word.map(seg => ({
      visible: true,
      environment: null,
      dependents: {},
      currentChoiceIndices: [],
      choices: [],
      handlers: [],
      original: {
        type: seg.type,
        meta: {...seg.meta},
        value: seg.value,
        context: seg.context,
      },
    }));
  }

  update(idx, choicesIdx, newChoiceIdx) {
    const tracker = this.trackers[idx];
    tracker.currentChoiceIndices[choicesIdx] = newChoiceIdx;
    tracker.choices.splice(choicesIdx + 1);
    tracker.currentChoiceIndices.splice(choicesIdx + 1);
    // each handler is at the same idx as the choice it produces
    // so if we're only updating that choice and its consequences,
    // we should only consequentially have to rerun the handlers that
    // come after it
    for (let i = choicesIdx + 1; i < tracker.choices.length; i += 1) {
      tracker.choices.push(tracker.handlers[i]());
      tracker.currentChoiceIndices.push(0);
    }
    Object.entries(tracker.dependents).forEach(([depIdx, relationships]) => {
      this.invalidateDependencies(depIdx, relationships);
    });
  }

  invalidateDependencies(idx, deps) {
    const tracker = this.trackers[idx];
    tracker.choices.clear();
    tracker.currentChoiceIndices.clear();
    this.wordMap[this.word[idx].value].delete(idx);
    this.wordMap[tracker.original.value].add(idx);
    deps.forEach(key => {
      const depIdx = tracker.environment[key];
      this.trackers[depIdx].dependents.delete(idx);
      delete tracker.environment[key];
    });
    tracker.handlers.forEach(curriedHandler => {
      tracker.choices.push(curriedHandler());
      tracker.currentChoiceIndices.push(0);
    });
    Object.entries(tracker.dependents).forEach(([depIdx, relationships]) => {
      this.invalidateDependencies(depIdx, relationships);
    });
  }

  searchSegmentRight(idx, props) {
    for (let i = idx + 1; i < this.word.length; i += 1) {
      if (props.matches(this.word[i])) {
        return i;
      }
    }
    return null;
  }

  searchSegmentLeft(idx, props) {
    for (let i = idx - 1; i >= 0; i -= 1) {
      if (props.matches(this.word[i])) {
        return i;
      }
    }
    return null;
  }

  react(dep, relationship) {
    const dependency = this.trackers[dep].value;
    if (!dependency.dependents[dep]) {
      dependency.dependents[dep] = new Set([relationship]);
    } else {
      dependency.dependents[dep].add(relationship);
    }
    return dep;
  }

  depGetter(idx) {
    return key => {
      switch (key) {
        case depType.type:
          return this.word[idx].type;
        case depType.meta:
          return this.word[idx].meta;
        case depType.wordType:
          return this.word.type;
        case depType.wordMeta:
          return this.word.meta;
        case depType.word:
          return this.word.value;
        case depType.prevConsonant:
          return this.react(this.searchSegmentRight(idx, consonantPred));
        case depType.nextConsonant:
          return this.react(this.searchSegmentLeft(idx, consonantPred));
        case depType.prevVowel:
          return this.react(this.searchSegmentRight(idx, vowelPred));
        case depType.nextVowel:
          return this.react(this.searchSegmentRight(idx, vowelPred));
        default:
          throw new Error(
            `Unknown dep: ${key} for ${idx}, ${this.word[idx]} (enum value ${depType.keys[key]})`
          );
      }
    };
  }

  updateEnv(
    idx,
    dep
  ) {
    const tracker = this.trackers[idx];
    if (tracker.environment === null) {
      tracker.environment = {};
    }

    const getDependency = this.depGetter(idx);
    dep.forEach(key => {
      if (tracker.environment[key] === undefined) {
        const dependency = getDependency(key);
        tracker.environment[key] = dependency;
      }
    });

    return tracker.environment;
  }

  wrap(filter, results) {
    if (filter) {
      const deps = extractDeps(filter);
      // filter by calling the filter function on the environment it requests
      results = results.filter(idx => filter(this.updateEnv(idx, deps)));
    }
    if (!results || results.length === 0) {
      return () => {};
    }
    return handler => {
      const deps = extractDeps(handler);
      results.forEach(idx => {
        const tracker = this.trackers[idx];
        tracker.choices.push(handler(this.updateEnv(idx, deps)));
        tracker.currentChoiceIndices.push(0);
        tracker.handlers.push(() => handler(this.updateEnv(idx, deps)));
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

/*
needs some way of separating "become this underlying internal thing-eme"
from "become this surface form"
e.g. يضطر should have the ض "become" [ظ ض] (after a rule that
turns ظ into [ظ z*], not before), then have the ض variant be transformed by
a rule that optionally turns (voiced consonant)(unvoiced with same articulator & manner)
into a geminate
but both of those are underlying internal transformations, and the surface choice
should only come after all that
*/

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
    // f*** this makes no sense
  }]
];

module.exports = {
  rules,
};
