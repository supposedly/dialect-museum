import ruleset from '../../ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({special}) => special({shape: `maf3ale`}),
    env: {},
  },
  {
    maf3ale: ({features: {root: $}}) => [
      letters.plain.consonant.m,
      letters.plain.vowel.a,
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.plain.vowel.a,
      separateContext($[2], `affected`),
    ],
    maf3ile: ({features: {root: $}}) => [
      letters.plain.consonant.m,
      letters.plain.vowel.a,
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.plain.vowel.i,
      separateContext($[2], `affected`),
    ],
  },
  {
    affected: {
      spec: {
        context: {affected: true},
      },
    },
  }
);
