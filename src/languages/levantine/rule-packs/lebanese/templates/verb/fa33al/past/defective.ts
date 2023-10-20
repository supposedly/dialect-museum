import fa33al from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default fa33al(
  {
    spec: ({verb}) => verb((features, traits) => traits.defective),
    env: {},
  },
  {
    default: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.a,
      separateContext($[1], `affected`),
      separateContext($[1], `affected`),
      letters.plain.vowel.aa,
    ],
  }
);
