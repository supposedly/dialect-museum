import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({gender: `feminine`, number: `singular`}),
    env: {},
  },
  {
    default: [
      letters.plain.vowel.uu,
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
