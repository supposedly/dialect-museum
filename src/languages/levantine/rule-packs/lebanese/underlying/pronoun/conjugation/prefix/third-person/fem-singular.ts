import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `singular`, gender: `feminine`}),
    env: {},
  },
  {
    default: [
      letters.plain.consonant.t,
      letters.plain.vowel.i,
    ],
  }
);
