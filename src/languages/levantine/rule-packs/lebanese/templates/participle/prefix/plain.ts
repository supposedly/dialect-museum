import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {context: {affected: false}},
    env: {},
  },
  operations => ({
    default: [
      // not sure what the `i` will mean for kfarsghab form iii passive
      operations.preject(
        letters.plain.consonant.m,
        letters.plain.vowel.i,
      ),
    ],
  })
);
