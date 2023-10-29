import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.gender.feminine),
    env: {},
  },
  operations => ({
    default: [operations.postject(letters.plain.vowel.ii)],
  }),
);
