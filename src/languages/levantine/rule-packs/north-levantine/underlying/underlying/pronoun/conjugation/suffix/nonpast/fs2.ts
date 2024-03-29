import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `singular`, person: `second`, gender: `feminine`}),
    env: {},
  },
  {
    default: [letters.plain.vowel.ii],
  }
);
