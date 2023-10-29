import ruleset from './ruleset';
import letters from 'src/languages/levantine/alphabets/underlying/letters.js';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.number.singular),
    env: {},
  },
  {
    default: [letters.plain.vowel.ii],
  }
);
