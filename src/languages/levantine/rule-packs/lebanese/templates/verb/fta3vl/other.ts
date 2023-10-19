import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  operations => ({
    a: [
      // re use of context below: see ../form-1/fa3il/affected/NOTE.md
      operations.preject(letters.plain.consonant.t),
      operations.mock({features: {door: `fa3il`}, context: {affected: true}}),
    ],
    i: [
      // re use of context below: see ../form-1/fa3il/affected/NOTE.md
      operations.preject(letters.plain.consonant.t),
      operations.mock({features: {door: `fa3il`}, context: {affected: false}}),
    ],
  })
);
