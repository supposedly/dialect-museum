import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `plural`, person: {match: `any`, value: [`second`, `third`]}}),
    env: {},
  },
  {
    default: [letters.plain.vowel.uu],
  }
);
