import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.number.plural),
    env: {},
  },
  {
    default: [
      letters.plain.consonant.n,
      letters.plain.vowel.aa,
    ],
  }
);
