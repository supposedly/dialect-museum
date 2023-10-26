import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.vowel.i,
    env: {},
  },
  {
    u: [letters.plain.vowel.u],
    U: [letters.plain.vowel.ʊ],
    o: [letters.plain.vowel.o],
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
