import ruleset from '../ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 9}},
    env: {},
  },
  {
    tis3: [
      letters.plain.consonant.t,
      letters.plain.vowel.i,
      letters.plain.consonant.s,
      letters.plain.consonant.c,
    ],
  }
);
