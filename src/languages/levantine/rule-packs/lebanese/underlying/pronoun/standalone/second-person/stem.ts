import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.person.second),
    env: {},
  },
  {
    int: [
      letters.plain.consonant.$,
      letters.plain.vowel.i,
      letters.plain.consonant.n,
      letters.plain.consonant.t,
    ],
    hint: [
      letters.plain.consonant.h,
      letters.plain.vowel.i,
      letters.plain.consonant.n,
      letters.plain.consonant.t,
    ],
  }
);
