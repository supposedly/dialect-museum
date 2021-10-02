import type {Syllable} from '../../../types';
import {obj} from '../objects';
import objType from '../parsing/type';
import {isConsonant, isVowel, Segment, SegType} from '../symbols';
import {lastOf} from './misc';

export function isSyllable(s: any): s is Syllable {
  return s.type === objType.syllable;
}

export function newSyllable(string: Segment[] = []) {
  return obj.obj(
    objType.syllable,
    {stressed: null, weight: null},
    string,
  );
}

export function getSyllableWeight(s: Syllable) {
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
    if (segment.type === SegType.suffix) {
      // should technically be rimeLength =
      // instead of rimeLength +=
      // but idk maybe if i have something bugged like `word=b` it'd
      // be good to handle it "properly" lol
      // (that is 'bugged' because it uses the dual suffix, `=`, non-word-finally)
      if (segment.value === `fem`) {
        /*
        // meta.t === false: suffix is V
        // meta.t === true: suffix is VC (as in Vt)
        rimeLength += 1 + segment.meta.t;
        */
        rimeLength += 1.5;  // screw it
      } else if (segment.value === `adverbial`) {
        // -an
        rimeLength += 2;
      } else {
        // all the other suffixes are VVC
        rimeLength += 3;
      }
      break;
    }
    // long vowels add 2, short vowels add 1
    if (isVowel(segment)) {
      rimeLength += segment.meta.features.length;
      break;
    }
    if (isConsonant(segment)) {
      // consonants just add 1
      rimeLength += 1;
    }
    // the remaining type is epenthetic, which adds 0
  }
  return rimeLength;
}

// determine & set stressed syllable according to weights
export function setStressedSyllable(syllables: Syllable[], clearRest = false) {
  syllables = syllables.filter(isSyllable);
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
    if (final.meta.weight > 2) {
      final.meta.stressed = true;
    } else {
      penult.meta.stressed = true;
    }
    return;
  }

  if (syllables.length >= 3) {
    if (final.meta.weight > 2) {
      final.meta.stressed = true;
    } else if (penult.meta.weight > 1) {
      penult.meta.stressed = true;
    } else {
      antepenult.meta.stressed = true;
    }
  }
}

export function copy(things: Syllable[]): Syllable[] {
  return things.map(s => obj.obj(
    s.type,
    {...s.meta},
    [...s.value],
  ));
}
