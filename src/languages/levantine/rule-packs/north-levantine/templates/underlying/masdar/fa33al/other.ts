import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

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
  },
  {
    affected: {
      spec: {context: {affected: true}},
    },
  }
);
