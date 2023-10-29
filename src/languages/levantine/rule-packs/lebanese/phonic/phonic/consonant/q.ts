import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.consonant.r,
    env: {},
  },
  operations => ({
    debuccalized: [operations.mock(letters.plain.consonant.$)],
    retained: c => [c],
  }),
);
