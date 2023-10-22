import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {context: {affected: false}},
    env: {},
  },
  {
    taf3iil: ({features: {root: $}}) => [
      letters.affected.consonant.t,
      letters.affected.vowel.a,
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.affected.vowel.ii,
      separateContext($[2], `affected`),
    ],
    tif3iil: ({features: {root: $}}) => [
      letters.affected.consonant.t,
      letters.affected.vowel.i,
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.affected.vowel.ii,
      separateContext($[2], `affected`),
    ],
  }
);
