import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.nonpast),
    env: {},
  },
  {
    default: ({features: {root: $, theme}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel[theme],
      separateContext($[1], `affected`),
      separateContext($[2], `affected`),
    ],
  }
);
