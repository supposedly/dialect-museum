import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.vowel.i,
    env: {},
  },
  {
    i: [letters.plain.vowel.i],
    I: [letters.plain.vowel.ɪ],
    e: [letters.plain.vowel.e],
  },
  {
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant())),
    },
    // TODO: stress
    unstressedOpen: {
      env: ({before}, {boundary}) => before(boundary(`syllable`)),
    },
  }
);
