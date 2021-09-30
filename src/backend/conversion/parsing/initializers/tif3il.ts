import * as utils from '../../utils';
const { misc: { lastOf }, syllables: { newSyllable } } = utils;
/* const {obj} = require('../../objects'); */
import { parseWord, parseLetter } from '../../parse-word';

const AA = Object.freeze(parseLetter`aa`);
const A = Object.freeze(parseLetter(`a`));
const I = Object.freeze(parseLetter`i`);
const FEM = Object.freeze(parseLetter`c`);
/* const FEM_T = Object.freeze(obj.edit(parseLetter`c`, {meta: {t: true}})); */

// transformer: -iiY(+c) and -iiY+C => -aayc and -aayC
// only to be used when last consonant is weak
function aayc(suffix) {
  return base => {
    const lastSyllable = lastOf(base).value;
    lastSyllable.splice(-2, 1, AA);
    base.push(newSyllable(
      suffix.length
        ? [lastSyllable.pop(), ...suffix]
        : [lastSyllable.pop(), FEM]
    ));
  };
}

// transformer: -iiC(+fem) and -ii+fplural => -iCfem and -iCfplural
// like tasmiye, tarbiye, etc (only for weak final consonant)
function fus7aEnding(suffix) {
  return base => {
    const lastSyllable = lastOf(base).value;
    lastSyllable.splice(-2, 1, I);
    base.push(newSyllable(
      suffix.length
        ? [lastSyllable.pop(), ...suffix]
        : [lastSyllable.pop(), FEM]
    ));
  };
}

// transformer: -iC
function soundSuffix(suffix) {
  return base => {
    const lastSyllable = lastOf(base).value;
    if (suffix.length > 1) {
      // for now, this means that it starts with the fem suffix and ends with another
      if (suffix[1].value === `an`) {
        // this is hilariously stupid
        // for example with the word 3adatan, it turns
        // $`3.aa.d` (suffix: c.@) into $`3.aa d c.@`
        // but the goal is just to get loosely correct syllable
        // weights that allow for nothing more than accurate stress assignment
        // since syllables don't actually real and will get collapsed before
        // leaving this under-the-hood phase anyway
        base.push(newSyllable([lastSyllable.pop()]));
      }
      base.push(newSyllable([...suffix]));
    } else {
      base.push(newSyllable([lastSyllable.pop(), ...suffix]));
    }
  };
}

// make it t.a.f.3.ii.l instead of t.a/i.f.3.ii.l
function aiToA(base) {
  base[0].value[1] = A;
}

// post-transformer: adds augmentations to meta
// TODO: error on dative
function augment(augmentation) {
  return augmentation && ((base, meta) => {
    meta.augmentation = augmentation(base);
  });
}

// this WILL NOT cater to forms like tajribe, which are fus7a loanwords and not
// productively-formed verbal nouns
// third-weak taf3iye vn's are fine tho
export default function tif3il({
  type: was,
  value: {
    root: [$F, $3, $L, $Q],
    suffix = [],
    augmentation,
  },
  context,
}) {
  if ($Q) {
    throw new Error(
      `Can't use quadriliteral root with taf3il: ${$F.value}${$3.value}${$L.value}${$Q.value}`,
    );
  }

  // for example:
  // (tif3il <a> qrb@) = ta2riban (aka taqrIb@)
  // ...not sure if <fus7a> should imply <a>
  const taf3il = context.has(`a`);
  const onlyFus7aEnding = context.has(`fus7a`);

  const meta = {
    was,
    root: [$F, $3, $L],
  };

  // add -c to the beginning of the suffix if it's a final-weak root
  if (
    $L.meta.weak && (
      !suffix.length || (
        suffix[0].value !== `fem` && suffix[0].value !== `fplural`
      )
    )
  ) {
    /* suffix = [suffix.length ? FEM_T : FEM, ...suffix]; */
    suffix = [FEM, ...suffix];
  }

  const onlyA = taf3il && aiToA;

  const $ = $L.meta.weak
    ? parseWord({
      preTransform: onlyFus7aEnding
        // if there's no suffix these will both default to FEM which is correct
        ? [[onlyA, fus7aEnding(suffix)]]
        : [[onlyA, aayc(suffix)], [onlyA, fus7aEnding(suffix)]],
      postTransform: [[augment(augmentation)]],
      meta,
    })
    : parseWord({
      preTransform: [[onlyA, suffix.length && soundSuffix(suffix)]],
      postTransform: [[augment(augmentation)]],
      meta,
    });

  return [
    ...$`t.i.${$F} ${$3}.ii.${$L}`,
    ...$`t.a.${$F} ${$3}.ii.${$L}`,
  ];
}
