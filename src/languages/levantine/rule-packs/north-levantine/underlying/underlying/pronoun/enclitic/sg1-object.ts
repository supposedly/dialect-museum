import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `singular`, person: `first`}),
    env: ({after}, {delimiter}) => after(delimiter({match: `any`, value: [`object`, `pseudosubject`]})),
  },
  {
    default: [
      letters.plain.consonant.n,
      letters.plain.vowel.ii,
    ],
  }
);
