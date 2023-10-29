import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.vowel.o,
    env: {},
  },
  {
    e: [letters.plain.vowel.e],
  },
  {
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant())),
    },
    inForm1Imperf: {
      was: {
        templates: {
          spec: ({verb}) => verb({door: `f3vl`, theme: `u`}),  // need traits.nonpast too?
        },
      },
    },
    // TODO: stress
    unstressedOpen: {
      env: ({before}, {boundary}) => before(boundary(`syllable`)),
    },
  }
);
