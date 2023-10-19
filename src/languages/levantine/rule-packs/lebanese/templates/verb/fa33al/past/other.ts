import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    default: ({features: {root: [$F, $3, $L]}}) => [
      separateContext($F, `affected`),
      letters.plain.vowel.a,
      separateContext($3, `affected`),
      separateContext($3, `affected`),
      letters.plain.vowel.a,
      separateContext($L, `affected`),
    ],
  }
);
