import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({gender: `feminine`, number: `singular`}),
    env: {},
  },
  {
    it: [
      letters.plain.vowel.i,
      letters.plain.consonant.t,
    ],
    at: [
      letters.plain.vowel.a,
      letters.plain.consonant.t,
    ],
  },
  {
    wordFinal: {
      env: ({before}, {boundary}) => before(boundary()),
    },
    beforeSuffix: {
      env: ({before}, {delimiter}) => before(delimiter()),
    },
  }
);
