import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {context: {affected: true}},
    env: {},
  },
  operations => ({
    default: [
      operations.preject(
        letters.affected.consonant.m,
        letters.affected.vowel.u,
      ),
    ],
  })
);
