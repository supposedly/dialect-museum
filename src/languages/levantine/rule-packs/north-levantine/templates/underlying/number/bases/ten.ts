import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 6}},
    env: {},
  },
  {
    cashr: [
      letters.plain.consonant.c,
      letters.plain.vowel.a,
      letters.plain.consonant.sh,
      letters.plain.consonant.r,
    ],
  }
);
