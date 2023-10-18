import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    default: ({features: {root: [$F, $3, $L], theme}}) => [
      separateContext($F, `affected`),
      separateContext($3, `affected`),
      letters.plain.vowel[theme],
      separateContext($L, `affected`),
    ],
  }
);
