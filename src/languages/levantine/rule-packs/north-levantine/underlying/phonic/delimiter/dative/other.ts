import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  operations => ({
    default: [
      operations.preject({type: `boundary`, features: {type: `morpheme`}, context: {affected: false}}),
      operations.mock(letters.plain.consonant.l),
    ],
  }),
);
