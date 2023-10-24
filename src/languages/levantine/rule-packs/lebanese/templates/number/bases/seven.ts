import ruleset from '../ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 7}},
    env: {},
  },
  {
    sab3: [
      letters.plain.consonant.s,
      letters.plain.vowel.a,
      letters.plain.consonant.b,
      letters.plain.consonant.c,
    ],
  }
);
