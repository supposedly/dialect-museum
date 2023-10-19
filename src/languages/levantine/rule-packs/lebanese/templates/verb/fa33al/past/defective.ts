import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.defective),
    env: {},
  },
  {
    default: ({features: {root: [$F, $3]}}) => [
      separateContext($F, `affected`),
      letters.plain.vowel.a,
      separateContext($3, `affected`),
      separateContext($3, `affected`),
      letters.plain.vowel.aa,
    ],
  }
);
