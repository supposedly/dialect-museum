import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb(features => features.tam.imperative),
    env: {},
  },
  {
    default: ({features: {root: [$F, $3]}}) => [
      separateContext($F, `affected`),
      separateContext($3, `affected`),
      letters.plain.vowel.ii,
    ],
  }
);
