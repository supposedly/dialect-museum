import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.person.second),
    env: {},
  },
  {
    default: [letters.plain.consonant.k],
  }
);
