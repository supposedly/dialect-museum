import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {
      target: {
        env: ({before}, {consonant}) => before(consonant()),
      },
    },
  },
  {
    default: ({features: {root: [$F, $3, $L]}}) => [
      separateContext($F, `affected`),
      letters.plain.vowel.a,
      separateContext($3, `affected`),
      separateContext($L, `affected`),
      letters.plain.vowel.a,
      letters.plain.consonant.y,
    ],
  }
);
