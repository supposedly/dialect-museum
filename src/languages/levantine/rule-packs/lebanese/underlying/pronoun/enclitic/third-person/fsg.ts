import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `singular`, gender: `feminine`}),
    env: {},
  },
  operations => ({
    default: [operations.postject(letters.plain.vowel.aa)],
  }),
);
