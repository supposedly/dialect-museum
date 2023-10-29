import ruleset from '../../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: ({special}) => special({shape: `fa3aaliiq`, root: {length: 4}}),
    env: {},
  },
  {
    f3aaliiq: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.plain.vowel.aa,
      separateContext($[2], `affected`),
      letters.plain.vowel.ii,
      separateContext($[3], `affected`),
    ],
    fa3aliiq: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.a,
      separateContext($[1], `affected`),
      letters.plain.vowel.a,
      separateContext($[2], `affected`),
      letters.plain.vowel.ii,
      separateContext($[3], `affected`),
    ],
    fa3aaliiq: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.a,
      separateContext($[1], `affected`),
      letters.plain.vowel.aa,
      separateContext($[2], `affected`),
      letters.plain.vowel.ii,
      separateContext($[3], `affected`),
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
