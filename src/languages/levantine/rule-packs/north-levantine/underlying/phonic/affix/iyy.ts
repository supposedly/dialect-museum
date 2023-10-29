import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    // FIXME nah undo the thing where you have to omit the key (i want to write affix({symbol: `indicative`}))
    spec: ({affix}) => affix(`iyy`),
    env: {},
  },
  operations => ({
    default: [
      operations.mock(
        letters.plain.vowel.i,
        letters.plain.consonant.y,
        letters.plain.consonant.y,
      ),
    ],
  }),
);
