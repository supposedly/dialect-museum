import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.gender.feminine),
    env: {},
  },
  {
    default: [
      letters.plain.consonant.t,
      letters.plain.vowel.ii,
    ],
  }
);
