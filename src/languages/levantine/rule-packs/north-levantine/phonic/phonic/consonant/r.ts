import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.consonant.r,
    env: {},
  },
  operations => ({
    deemphasized: [operations.mock({features: {emphatic: false}})],
    retained: c => [c],
  }),
);
