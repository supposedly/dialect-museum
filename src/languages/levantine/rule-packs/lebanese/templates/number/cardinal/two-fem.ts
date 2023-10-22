import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 2, gender: `feminine`}},
    env: {},
  },
  {
    default: [
      letters.plain.consonant.th,
      letters.plain.vowel.i,
      letters.plain.consonant.n,
      letters.plain.consonant.t,
      letters.plain.vowel.ay,
      letters.plain.consonant.n,
    ],
  }
);
