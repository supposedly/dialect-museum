import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.nonpast),
    env: {},
  },
  {
    default: ({features: {root: [$F, $3, $L], theme}}) => [
      separateContext($F, `affected`),
      letters.plain.vowel[theme],
      separateContext($3, `affected`),
      separateContext($L, `affected`),
    ],
  }
);
