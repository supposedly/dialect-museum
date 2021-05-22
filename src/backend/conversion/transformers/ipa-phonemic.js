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
  Fem: `c`,
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

function mapWord(word) {
  const segMap = {};
  word.value.forEach((syllable, sylIdx) => {
    syllable.value.forEach((segment, segIdx) => {
      if (Array.isArray(segMap[segment])) {
        segMap[segment].push([sylIdx, segIdx]);
      } else {
        segMap[segment] = [[sylIdx, segIdx]];
      }
    });
  });
  return segMap;
}

const rules = [
  [_.Fem, (abc, ctx, {previousVowel, previousConsonant}) => {
    if (ctx.femA) {
      return [abc.Fem.low];
    }
    if (previousConsonant.value === `r` && previousVowel.meta.intrinsic.ly.high && !previousVowel.meta.intrinsic.ly.rounded) {
      return [abc.Fem.high];
    }
    if (previousConsonant.meta.intrinsic.ly.emphatic || previousConsonant.value === `r`) {
      // maybe emphatics can sometimes have -e idk
      return [abc.Fem.low];
    }
    if (ctx.type === `participle`) {
      return [abc.Fem.high, abc.Fem.low];
    }
    return [abc.Fem.high];
  }],
  [_.i, (abc, ctx, {previousConsonant, nextConsonant, codaConsonant}) => {
    // fuck this makes no sense
  }]
];

module.exports = {
  rules,
};
