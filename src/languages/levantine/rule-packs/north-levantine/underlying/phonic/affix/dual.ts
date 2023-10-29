import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    // FIXME nah undo the thing where you have to omit the key (i want to write affix({symbol: `indicative`}))
    spec: ({affix}) => affix(`dual`),
    env: {},
  },
  operations => ({
    ayn: [
      operations.mock(
        letters.plain.vowel.a,
        letters.plain.consonant.y,
        letters.plain.consonant.n
      ),
    ],
    // bint jbeil by el-mekki apparently
    aan: [
      operations.mock(
        letters.affected.vowel.aa,
        letters.plain.consonant.n
      ),
    ],
  }),
);
