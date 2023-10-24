import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `singular`, person: `first`}),
    env: ({after}, {delimiter}) => after(delimiter(features => features.symbol.object)),
  },
  {
    default: [
      letters.plain.consonant.n,
      letters.plain.vowel.ii,
    ],
  }
);
