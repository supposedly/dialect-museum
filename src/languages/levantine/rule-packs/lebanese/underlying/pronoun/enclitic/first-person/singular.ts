import ruleset from './base';
import letters from '/languages/levantine/alphabets/underlying/letters.js';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.number.singular),
    env: {},
  },
  {
    default: [letters.plain.vowel.ii],
  }
);
