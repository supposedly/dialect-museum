import ruleset from '../../ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({special}) => special({shape: `fa3aaliq`, root: {length: 4}}),
    env: {},
  },
  {
    f3aaliq: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.plain.vowel.aa,
      separateContext($[2], `affected`),
      letters.plain.vowel.i,
      separateContext($[3], `affected`),
    ],
    fa3aaliq: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.a,
      separateContext($[1], `affected`),
      letters.plain.vowel.aa,
      separateContext($[2], `affected`),
      letters.plain.vowel.i,
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
