import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `plural`, person: {match: `any`, value: [`second`, `third`]}}),
    env: {},
  },
  {
    default: [letters.plain.vowel.uu],
  }
);
