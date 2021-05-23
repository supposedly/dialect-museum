/* eslint-disable max-classes-per-file */
const symbols = require(`../symbols`);
const {type: objType} = require(`../objs`);

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

function mapWord(word) {
  const segMap = {};
  word.value.forEach((syllable, sylIdx) => {
    syllable.value.forEach(({value: segment}, segIdx) => {
      if (Array.isArray(segMap[segment])) {
        segMap[segment].push([sylIdx, segIdx]);
      } else {
        segMap[segment] = [[sylIdx, segIdx]];
      }
    });
  });
  return segMap;
}

class Props {
  constructor(obj) {
    if (obj === undefined || obj === null) {
      this.obj = {};
      this.empty = true;
    } else {
      const objCopy = {...(obj instanceof Props ? obj.obj : obj)};
      Object.entries(objCopy).forEach(([k, v]) => {
        if (!(v instanceof Props) && v instanceof Object && !Array.isArray(v)) {
          objCopy[k] = new Props(v);
        }
      });
      this.obj = objCopy;
      this.empty = false;
    }
  }

  matches(other) {
    return this.empty || this.obj.entries.every(([k, v]) => {
      if (Object.prototype.hasOwnProperty.call(other, k)) {
        return v instanceof Props ? v.matches(other[k]) : v === k;
      }
      return false;
    });
  }
}

const consonantPred = new Props({type: objType.consonant});
const vowelPred = new Props({type: objType.vowel});

class Cap {
  constructor(word) {
    this.word = { ...word };
    this.wordMap = mapWord(this.word.value);
  }

  searchSegmentRight(syl, seg, props) {
    const syllable = this.word.value[syl].value;
    if (seg === null) {
      seg = syllable.length - 1;
    }
    for (let i = seg - 1; i >= 0; i -= 1) {
      if (props.matches(syllable[i])) {
        return syllable[i];
      }
    }
    if (syl > 0) {
      return this.searchSegmentRight(syl - 1, null, props);
    }
    return null;
  }

  searchSegmentLeft(syl, seg, props) {
    const syllable = this.word.value[syl].value;
    if (seg === null) {
      seg = 0;
    }
    for (let i = seg + 1; i < syllable.length; i += 1) {
      if (props.matches(syllable[i])) {
        return syllable[i];
      }
    }
    if (syl < this.word.value.length - 1) {
      return this.searchSegmentLeft(syl + 1, 0, props);
    }
    return null;
  }

  environment(
    [syl, seg],
    {
      prevConsonant,
      nextConsonant,
      prevVowel,
      nextVowel,
      lastConsonant,
      lastVowel,
      suffix,
      augmentation
    }
  ) {
    return {
      type: this.word.type,
      meta: this.word.meta,
      prevConsonant: prevConsonant && this.searchSegmentRight(syl, seg, consonantPred),
      nextConsonant: nextConsonant && this.searchSegmentLeft(syl, seg, consonantPred),
      prevVowel: prevVowel && this.searchSegmentRight(syl, seg, vowelPred),
      nextVowel: nextVowel && this.searchSegmentRight(syl, seg, vowelPred),
    };
  }

  wrap(results) {
    if (!results || results.length === 0) {
      return _handler => {};
    }
    // TODO: inspect handler to determine its dependencies
    // assign dependencies to their dependents for change-listening
    // and finish everything
    return handler => results.forEach(handler);
  }

  just(obj) {
    const props = obj instanceof Props ? obj : new Props(obj);
    return this.wrap(this.wordMap[obj.value]);
  }

  segment(props) {
    props = props instanceof Props ? props : new Props(props);
    return this.wrap(
      Object.values(this.wordMap)
        .map(indices => indices.filter(([syl, seg]) => props.matches(this.word.value[syl][seg])))
        .flat()
    );
  }

  segmentOfType(type, props) {
    props = props instanceof Props ? props : new Props(props);
    // don't think i'll allow type or value to be set
    const {meta: {intrinsic, ...rawMeta}} = props.obj;
    const meta = new Props(rawMeta);
    const searchSpace = props && intrinsic
      ? subAlphabets[type].filter(c => intrinsic.matches(c.meta.intrinsic))
      : subAlphabets[type];
    return this.wrap(
      searchSpace
        .map(c => this.wordMap[c])
        .map(indices => indices.filter(
          ([syl, seg]) => meta.matches(this.word.value[syl][seg].meta))
        )
        .flat()
    );
  }

  consonant(props) {
    return this.segmentOfType(objType.consonant, props);
  }

  vowel(props) {
    return this.segmentOfType(objType.vowel, props);
  }

  epenthetic(props) {
    return this.segmentOfType(objType.epenthetic, props);
  }

  suffix(props) {
    return this.segmentOfType(objType.suffix, props);
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
