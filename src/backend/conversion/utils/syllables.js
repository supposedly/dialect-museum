const obj = require(`../objects`);
const { lastOf } = require(`./misc`);

module.exports.newSyllable = (string = []) => obj.obj(
  `syllable`,
  { stressed: null, weight: null },
  string
);

module.exports.getSyllableWeight = s => {
  // 0 segments in syllable = weight of -1
  // 1 segment in syllable = weight of 0
  if (s.value.length <= 1) {
    return s.value.length - 1;
  }
  // otherwise just count sound units
  let rimeLength = 0;
  // go backwards so we can break when we reach the nucleus (aka before the onset)
  for (let i = s.value.length - 1; i > 0; i -= 1) {
    const segment = s.value[i];
    if (segment.type === `suffix`) {
      // should technically be rimeLength =
      // instead of rimeLength +=
      // but idk maybe if i have something bugged like `word=b` it'd
      // be good to handle it "properly" lol
      // (that is 'bugged' because it uses the dual suffix, `=`, non-word-finally)
      if (segment.value === `fem`) {
        // meta.t === false: suffix is V
        // meta.t === true: suffix is VC (as in Vt)
        rimeLength += 1 + segment.meta.t;
      } else {
        // all the other suffixes are VVC
        rimeLength += 3;
      }
      break;
    }
    // long vowels add 2, short vowels add 1
    if (segment.type === `vowel`) {
      rimeLength += segment.meta.intrinsic.length;
      break;
    }
    if (segment.type === `consonant`) {
      // consonants just add 1
      rimeLength += 1;
    }
    // the remaining type is epenthetic, which adds 0
  }
  return rimeLength;
};

// determine & set stressed syllable according to weights
module.exports.setStressedSyllable = (syllables, clearRest = false) => {
  if (clearRest) {
    syllables.forEach(s => { s.meta.stressed = false; });
  }

  if (syllables.length === 1) {
    syllables[0].meta.stressed = true;
    return;
  }

  const final = lastOf(syllables);
  const penult = lastOf(syllables, 1);
  const antepenult = lastOf(syllables, 2);

  if (syllables.length === 2) {
    if (final.meta.weight >= 3) {
      final.meta.stressed = true;
    } else {
      penult.meta.stressed = true;
    }
    return;
  }

  if (syllables.length >= 3) {
    if (final.meta.weight >= 3) {
      final.meta.stressed = true;
    } else if (penult.meta.weight >= 2) {
      penult.meta.stressed = true;
    } else {
      antepenult.meta.stressed = true;
    }
  }
};
