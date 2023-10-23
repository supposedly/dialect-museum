import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.person.second),
    env: {},
  },
  {
    default: [letters.plain.consonant.k],
  }
);
