import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 8}},
    env: {},
  },
  {
    tmaan: [
      letters.plain.consonant.th,
      letters.plain.consonant.m,
      letters.plain.vowel.aa,
      letters.plain.consonant.n,
    ],
    tman: [
      letters.plain.consonant.th,
      letters.plain.consonant.m,
      letters.plain.vowel.a,
      letters.plain.consonant.n,
    ],
  }
);
