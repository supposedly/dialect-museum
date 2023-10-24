import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb(features => features.tam.past),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.$, letters.plain.vowel.a),
      operations.mock({features: {door: `f3vl`, theme: `a`}}),
    ],
  })
);

// decided against this because i think it'd misrepresent hollow roots?
/*
import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb(features => features.tam.past),
    env: {},
  },
  operations => ({
    default: ({features: {root}}) => [
      operations.mock({
        features: {
          door: `fa3la2`,
          root: [letters.plain.consonant.$, ...root],
        },
      }),
    ],
  })
);
*/
