import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

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
      letters.plain.vowel.a,
      letters.plain.consonant.y,
      letters.plain.consonant.n,
    ],
  }
);
