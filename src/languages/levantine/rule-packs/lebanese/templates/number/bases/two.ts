import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 2}},
    env: {},
  },
  {
    tneen: [
      letters.plain.consonant.th,
      letters.plain.consonant.n,
      letters.plain.vowel.ee,
      letters.plain.consonant.n,
    ],
    tnayn: [
      letters.plain.consonant.th,
      letters.plain.consonant.n,
      letters.plain.vowel.ay,
      letters.plain.consonant.n,
    ],
  }
);
