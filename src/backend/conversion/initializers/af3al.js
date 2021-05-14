const { misc: { lastOf }} = require(`../utils`);
const { parseWord, parseLetter } = require(`../parse-word`);

const AA = Object.freeze(parseLetter`aa`);

// transformer: replace -ay with -aa
function fixAy(base) {
  const lastSyllable = lastOf(base).value;
  if (lastOf(lastSyllable).meta.weak) {
    lastSyllable.splice(-2, 2, AA);
  }
}

// post-transformer: adds augmentations to meta depending on end of base
// and contracts long vowel VVC in base if augmentation is dative -l-
function augment(augmentation) {
  return augmentation && ((base, meta) => {
    const result = augmentation(base);
    // "2asra3li" vs. "ma 2asra3ni"
    meta.augmentation = result.delimiter === `dative` ? result.yFor1sg : result.nFor1sg;
  });
}

function af3al({ root: [$F, $3, $L, $Q], augmentation }) {
  const $ = parseWord({
    preTransform: [[fixAy]],
    postTransform: [[augment(augmentation)]]
  });

  if ($Q) {
    return $`2.a ${$F}.a.${$3} ${$L}.a/i.${$Q}`;
  }

  return $`2.a.${$F} ${$3}.a/i.${$L}`;
}

module.exports = {
  af3al
};
