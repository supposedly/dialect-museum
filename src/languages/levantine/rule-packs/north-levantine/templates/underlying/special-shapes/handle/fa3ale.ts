import ruleset from '../../ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({special}) => special({shape: `fa3ale`}),
    env: {},
  },
  {
    fa3ale: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.a,
      separateContext($[1], `affected`),
      letters.plain.vowel.a,
      separateContext($[2], `affected`),
    ],
    fa3le: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.a,
      separateContext($[1], `affected`),
      separateContext($[2], `affected`),
    ],
  },
  {
    affected: {
      spec: {
        context: {affected: true},
      },
    },
    inConstruct: {
      env: ({before}, {delimiter, pronoun}) => (
        before(delimiter(), pronoun())
      ),
    },
    beforePronoun: {
      env: ({before}, {pronoun, delimiter}) => before(pronoun.seek({}, {}, delimiter())),
    },
  }
);
