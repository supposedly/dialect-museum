import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {gender: `feminine`}},
    env: {},
  },
  operations => ({
    waa7ide: [
      operations.mock({features: {gender: `masculine`}}),
      // operations.postject(letters.plain.affix.f),
    ],
    wa7de: [
      letters.plain.consonant.w,
      letters.plain.vowel.a,
      letters.plain.consonant.x,
      letters.plain.consonant.d,
      // letters.plain.affix.f,
    ],
    wi7de: [
      letters.plain.consonant.w,
      letters.plain.vowel.i,
      letters.plain.consonant.x,
      letters.plain.consonant.d,
      // letters.plain.affix.f,
    ],
  })
);
