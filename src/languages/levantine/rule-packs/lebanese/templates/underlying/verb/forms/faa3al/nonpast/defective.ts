import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.defective),
    env: {},
  },
  {
    default: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.aa,
      separateContext($[1], `affected`),
      letters.plain.vowel.ii,
    ],
  }
);
