import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {
      target: {
        env: ({before}, {consonant}) => before(consonant()),
      },
    },
  },
  {
    default: ({features: {root: $, theme}}) => {
      return [
        separateContext($[0], `affected`),
        letters.plain.vowel[theme],
        separateContext($[2], `affected`),
      ];
    },
  }
);
