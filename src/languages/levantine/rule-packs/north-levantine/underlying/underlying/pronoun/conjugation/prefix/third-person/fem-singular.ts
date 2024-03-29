import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

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
