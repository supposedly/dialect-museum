import * as utils from '../../utils';
import {parseWord, parseLetter} from '../../parse-word';

const {misc: {lastOf}} = utils;
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
    meta.augmentation = augmentation(base);
  });
}

export default function af3al({value: {root: [$F, $3, $L, $Q], augmentation}}) {
  const $ = parseWord({
    preTransform: [[fixAy]],
    postTransform: [[augment(augmentation)]],
  });

  if ($Q) {
    return [
      ...$`2.a ${$F}.a.${$3} ${$L}.a.${$Q}`,
      ...$`2.a ${$F}.a.${$3} ${$L}.i.${$Q}`,
    ];
  }

  if ($3.value === $L.value) {
    // 2afa33 is more-likely to be formed from words where the 3 is
    // geminate than words where it's split, e.g. sa77 & muhimm ->
    // 2asa77 & 2ahamm, with 2as7a7 and especially 2ahmam way less
    // likely, but 5afiif -> 2a5faf more likely than 2a5aff
    // TODO: figure out a way to implement that
    return [
      ...$`2.a ${$F}.a.${$3}.${$L}`,
      ...$`2.a ${$F}.a.${$3} ${$L}.a`,
      ...$`2.a.${$F} ${$3}.a.${$L}`,
      ...$`2.a.${$F} ${$3}.i.${$L}`,
    ];
  }

  return [
    ...$`2.a.${$F} ${$3}.a.${$L}`,
    ...$`2.a.${$F} ${$3}.i.${$L}`,
  ];
}
