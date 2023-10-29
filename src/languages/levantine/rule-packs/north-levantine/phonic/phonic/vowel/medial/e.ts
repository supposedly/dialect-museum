import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.vowel.e,
    env: {},
  },
  {
    schwa: [letters.plain.vowel.ə],
    o: [letters.plain.vowel.o],
  },
  {
    nextToEmphatic: {
      env: ({before, after}, {consonant}) => ({
        match: `any`,
        value: [
          before(consonant({emphatic: true})),
          after(consonant({emphatic: true})),
        ],
      }),
    },
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant())),
    },
  }
);
