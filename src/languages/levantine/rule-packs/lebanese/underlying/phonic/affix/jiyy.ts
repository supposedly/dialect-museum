import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    // FIXME nah undo the thing where you have to omit the key (i want to write affix({symbol: `indicative`}))
    spec: ({affix}) => affix(`jiyy`),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(
        operations.mock(
          letters.plain.consonant.j,
        ),
      ),
      operations.mock(({affix}) => affix(`iyy`)),
    ],
  }),
);
