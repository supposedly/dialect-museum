const {misc: {lastOf}, syllables: {newSyllable}} = require(`../../utils`);
const {parseWord, parseLetter} = require(`../../parse-word`);

const AA = Object.freeze(parseLetter`aa`);
const I = Object.freeze(parseLetter`i`);
const Y = Object.freeze(parseLetter`y`);
const FEM = Object.freeze(parseLetter`Fem`);

// transformer: -iiY(+c) and -iiY+C => -aayc and -aayC
// only to be used when last consonant is weak
function aayc(suffix) {
  return base => {
    const lastSyllable = lastOf(base).value;
    lastSyllable.splice(-1, 1, AA);
    base.push(newSyllable([Y, suffix || FEM]));
  };
}

// transformer: -ii(+c) and -ii+C => -iyC and -iyC
// only to be used when last consonant is weak
function iyc(suffix) {
  return base => {
    const lastSyllable = lastOf(base).value;
    lastSyllable.splice(-1, 1, I);
    base.push(newSyllable([Y, suffix || FEM]));
  };
}

// transformer: -iC
function addSuffix(suffix) {
  return base => {
    const lastSyllable = lastOf(base).value;
    base.push(newSyllable([lastSyllable.pop(), suffix]));
  };
}

// post-transformer: adds augmentations to meta
// TODO: error on dative
function augment(augmentation) {
  return augmentation && ((base, meta) => {
    meta.augmentation = augmentation(base).yFor1sg;
  });
}

function tif3il({type: was, root: [$F, $3, $L, $Q], suffix, augmentation}) {
  if ($Q) {
    throw new Error(
      `Can't use quadriliteral root with taf3il: ${$F.value}${$3.value}${$L.value}${$Q.value}`,
    );
  }

  const meta = {
    was,
    root: [$F, $3, $L],
  };

  const $ = $L.meta.weak
    ? parseWord({
      // if there's no suffix these will both default to FEM which is correct
      preTransform: [[aayc(suffix)], [iyc(suffix)]],
      postTransform: [[augment(augmentation)]],
      meta,
    })
    : parseWord({
      preTransform: [[suffix && addSuffix(suffix)]],
      postTransform: [[augment(augmentation)]],
      meta,
    });

  return $`t.a/i.${$F} ${$3}.ii.${$L}`;
}

module.exports = {
  tif3il,
};
