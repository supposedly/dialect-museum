import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

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
