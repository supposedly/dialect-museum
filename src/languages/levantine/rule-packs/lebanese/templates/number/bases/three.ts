import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 3}},
    env: {},
  },
  {
    thlaath: [
      letters.plain.consonant.th,
      letters.plain.consonant.l,
      letters.plain.vowel.aa,
      letters.plain.consonant.th,
    ],
    tlaat: [
      letters.plain.consonant.t,
      letters.plain.consonant.l,
      letters.plain.vowel.aa,
      letters.plain.consonant.t,
    ],
    tnaat: [
      letters.plain.consonant.t,
      letters.plain.consonant.n,
      letters.plain.vowel.aa,
      letters.plain.consonant.t,
    ],
  }
);
