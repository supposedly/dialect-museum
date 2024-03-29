import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => ({
      match: `any`,
      value: [
        traits.geminate,
        traits.hollow,
      ],
    })),
    env: {},
  },
  operations => ({
    a: [
      operations.preject(
        letters.plain.consonant.s,
        letters.plain.consonant.t,
        letters.plain.vowel.a,
      ),
    ],
    noA: [
      operations.preject(
        letters.plain.consonant.s,
        letters.plain.consonant.t,
      ),
    ],
  }),
  {
    affected: {
      spec: {context: {affected: true}},
    },
  }
);
