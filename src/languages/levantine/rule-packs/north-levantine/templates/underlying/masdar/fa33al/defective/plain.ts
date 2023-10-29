import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {context: {affected: false}},
    env: {},
  },
  {
    default: ({features: {root: $}}) => [
      letters.affected.consonant.t,
      letters.affected.vowel.i,
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.affected.vowel.aa,
      // separateContext($[2 as number], `affected`),
      letters.affected.consonant.y,
      letters.plain.affix.f,
    ],
  },
);
