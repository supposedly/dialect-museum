import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.consonant.r,
    env: {},
  },
  operations => ({
    deemphasized: [operations.mock({features: {emphatic: false}})],
    retain: c => [c],
  }),
);
