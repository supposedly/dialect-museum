import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.gender.masculine),
    env: {},
  },
  operations => ({
    aa: [operations.postject(letters.plain.vowel.aa)],
    none: [],
  }),
);
