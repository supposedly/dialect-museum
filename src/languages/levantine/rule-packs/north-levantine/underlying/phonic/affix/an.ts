import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    // FIXME nah undo the thing where you have to omit the key (i want to write affix({symbol: `indicative`}))
    spec: ({affix}) => affix(`an`),
    env: {},
  },
  operations => ({
    default: [operations.mock(letters.affected.vowel.a, letters.affected.consonant.n)],
  }),
);
