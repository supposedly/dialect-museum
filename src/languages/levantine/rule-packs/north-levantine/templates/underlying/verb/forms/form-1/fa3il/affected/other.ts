import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    default: ({features: {root: $}}) => {
      return [
        separateContext($[0], `affected`),
        letters.plain.vowel.a,
        separateContext($[1], `affected`),
        letters.plain.vowel.i,
        separateContext($[2], `affected`),
      ];
    },
  }
);
