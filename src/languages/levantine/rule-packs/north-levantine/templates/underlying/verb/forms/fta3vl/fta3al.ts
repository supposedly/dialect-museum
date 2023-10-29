import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({theme: `a`}),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.t),
      operations.mock({features: {door: `fa3al`}}),
    ],
  })
);
