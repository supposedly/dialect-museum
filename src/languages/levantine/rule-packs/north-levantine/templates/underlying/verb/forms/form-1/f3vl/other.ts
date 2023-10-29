import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    default: ({features: {root: $, theme}}) => [
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.plain.vowel[theme],
      separateContext($[2], `affected`),
    ],
  }
);
