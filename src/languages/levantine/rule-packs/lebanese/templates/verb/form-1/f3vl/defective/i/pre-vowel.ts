import ruleset from './base';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {
      target: {
        env: ({before}, {vowel}) => before(vowel()),
      },
    },
  },
  {
    default: ({features: {root: [$F, $3]}}) => [
      separateContext($F, `affected`),
      separateContext($3, `affected`),
    ],
  }
);
