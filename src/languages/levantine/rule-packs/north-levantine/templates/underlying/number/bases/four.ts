import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 4}},
    env: {},
  },
  {
    arba3: [
      letters.plain.consonant.$,
      letters.plain.vowel.a,
      letters.plain.consonant.r,
      letters.plain.consonant.b,
      letters.plain.vowel.a,
      letters.plain.consonant.c,
    ],
  }
);
