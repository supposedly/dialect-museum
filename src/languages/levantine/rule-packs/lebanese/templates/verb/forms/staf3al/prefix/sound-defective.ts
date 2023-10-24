import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => ({
      match: `all`,
      value: [
        traits.ingeminate,
        {root: {2: {weak: false}}},
      ],
    })),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(
        letters.plain.consonant.s,
        letters.plain.consonant.t,
        letters.plain.vowel.a,
      ),
    ],
  }),
);
