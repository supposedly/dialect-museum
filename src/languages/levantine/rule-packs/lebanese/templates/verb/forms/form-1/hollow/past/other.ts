import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    default: ({features: {root: $}}) => {
      return [
        separateContext($[0], `affected`),
        letters.plain.vowel.aa,
        separateContext($[2], `affected`),
      ];
    },
  }
);
