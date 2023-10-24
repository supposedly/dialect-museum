import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({theme: `i`}),
    env: {},
  },
  operations => ({
    nfa3il: [
      // re use of context below: see ../form-1/fa3il/affected/NOTE.md
      operations.preject(letters.plain.consonant.n),
      operations.mock({features: {door: `fa3il`}, context: {affected: true}}),
    ],
    nfi3il: [
      // re use of context below: see ../form-1/fa3il/affected/NOTE.md
      operations.preject(letters.plain.consonant.n),
      operations.mock({features: {door: `fa3il`}, context: {affected: false}}),
    ],
  })
);
