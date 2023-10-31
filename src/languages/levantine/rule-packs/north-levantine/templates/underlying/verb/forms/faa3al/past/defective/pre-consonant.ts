import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: {},
    target: {
      env: ({before}, {consonant}) => before(consonant()),
    },
  },
  {
    default: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.aa,
      separateContext($[1], `affected`),
      letters.plain.vowel.a,
      letters.plain.consonant.y,
    ],
  }
);
