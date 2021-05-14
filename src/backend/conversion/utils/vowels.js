const { parseLetter } = require(`../parse-word`);

const I = Object.freeze(parseLetter`i`);
const LAX_I = Object.freeze(parseLetter`I`);
const U = Object.freeze(parseLetter`u`);
const LAX_U = Object.freeze(parseLetter`U`);
const A = Object.freeze(parseLetter`a`);
// const E = Object.freeze(parseLetter`e`);
// const O = Object.freeze(parseLetter`o`);

module.exports.contract = vowel => {
  if (vowel.meta.intrinsic.length < 2) {
    return vowel;
  }
  if (!vowel.meta.intrinsic.ly.diphthongal) {
    throw new Error(`Attempt to contract a diphthong: ${vowel.value}`);
  }
  // sloppy impl lul
  switch (vowel.value[0]) {
    case `a`:
      return A;
    case `i`:
    case `e`:
      return I;
    case `u`:
    case `o`:
      return U;
    default:
      throw new Error(`Invalid long vowel for contraction: ${vowel.value}`);
  }
};

module.exports.unlax = vowel => {
  if (vowel.meta.intrinsic.length > 1) {
    throw new Error(`Attempt to unlax long vowel: ${vowel.value}`);
  }
  switch (vowel.value) {
    case `I`:
    case `e`:
      return I;
    case `U`:
    case `o`:
      return U;
    default:
      throw new Error(`Invalid short vowel for unlaxing: ${vowel.value}`);
  }
};

module.exports.lax = vowel => {
  if (vowel.meta.intrinsic.length > 1) {
    throw new Error(`Attempt to lax long vowel: ${vowel.value}`);
  }
  switch (vowel.value) {
    case `i`:
      return LAX_I;
    case `u`:
      return LAX_U;
    default:
      throw new Error(`Invalid short vowel for laxing: ${vowel.value}`);
  }
};
