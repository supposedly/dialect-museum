import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb(features => features.theme.a),
    env: {},
  },
  {
    ending: {
      aa: ({features: {root: [$F, $3]}}) => [
        separateContext($F, `affected`),
        separateContext($3, `affected`),
        letters.plain.vowel.aa,
      ],
      none: ({features: {root: [$F, $3]}}) => [
        separateContext($F, `affected`),
        separateContext($3, `affected`),
      ],
    },
  }
);
