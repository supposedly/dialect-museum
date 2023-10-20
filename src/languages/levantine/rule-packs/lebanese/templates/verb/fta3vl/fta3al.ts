import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({theme: `a`}),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.n),
      operations.mock({features: {door: `fa3al`}}),
    ],
  })
);
