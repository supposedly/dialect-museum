import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.number.singular),
    env: {},
  },
  {
    default: [
      letters.plain.consonant.$,
      letters.plain.vowel.a,
      letters.plain.consonant.n,
      letters.plain.vowel.aa,
    ],
  }
);
