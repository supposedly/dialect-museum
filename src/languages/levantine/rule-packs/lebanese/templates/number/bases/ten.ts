import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';

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
