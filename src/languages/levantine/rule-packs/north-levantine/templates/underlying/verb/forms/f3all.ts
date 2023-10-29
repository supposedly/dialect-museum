import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb({door: `f3all`}),
    env: {},
  },
  {
    default: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.plain.vowel.a,
      separateContext($[2], `affected`),
      separateContext($[2], `affected`),
    ],
  }
);
