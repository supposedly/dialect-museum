import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({participle}) => participle({shape: `fa3laan`, voice: `active`}),
  },
  {
    default: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.a,
      separateContext($[1], `affected`),
      separateContext($[2], `affected`),
      letters.plain.vowel.aa,
      letters.plain.consonant.n,
    ],
  }
);
