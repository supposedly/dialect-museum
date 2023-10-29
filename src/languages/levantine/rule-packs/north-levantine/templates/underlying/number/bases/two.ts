import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

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
      letters.plain.vowel.a,
      letters.plain.consonant.y,
      letters.plain.consonant.n,
    ],
  }
);
