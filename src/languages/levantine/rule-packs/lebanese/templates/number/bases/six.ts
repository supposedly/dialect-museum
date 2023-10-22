import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';

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
