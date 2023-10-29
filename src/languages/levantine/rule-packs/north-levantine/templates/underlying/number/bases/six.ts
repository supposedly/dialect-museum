import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 6}},
    env: {},
  },
  {
    sitt: [
      letters.plain.consonant.s,
      letters.plain.vowel.i,
      letters.plain.consonant.t,
      letters.plain.consonant.t,
    ],
  }
);
