import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({}, context => context.affected(true)),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.$, letters.plain.vowel.a),
      operations.mock({features: {door: `f3vl`, theme: `i`}}),
    ],
  })
);

// decided against this because i think it'd misrepresent hollow roots?
/*
export default ruleset(
  {
    spec: ({verb}) => verb({}, context => context.affected(true)),
    env: {},
  },
  operations => ({
    default: ({features: {root, tam}}) => [
      operations.mock({
        features: {
          tam,
          door: `fa3la2`,
          root: [
            letters.plain.consonant.$,
            ...root,
          ],
        },
      }),
    ],
  })
);
*/
