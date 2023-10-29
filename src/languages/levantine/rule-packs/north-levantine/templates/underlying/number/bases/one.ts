import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 1}},
    env: {},
  },
  {
    default: [
      letters.plain.consonant.w,
      letters.plain.vowel.a,
      letters.plain.consonant.x,
      letters.plain.consonant.d,
    ],
  }
);
