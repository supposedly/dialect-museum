import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `singular`, gender: `feminine`}),
    env: {},
  },
  operations => ({
    default: [operations.postject(letters.plain.vowel.aa)],
  }),
);
