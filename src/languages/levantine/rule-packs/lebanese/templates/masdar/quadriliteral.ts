import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({masdar}) => masdar((features, traits) => traits.quadriliteral),
    env: {},
  },
  {
    fa3la2a: ({features: {root: $}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel.a,
      separateContext($[1], `affected`),
      separateContext($[2], `affected`),
      letters.plain.vowel.a,
      separateContext($[3], `affected`),
      letters.plain.affix.f,
    ],
    tfi3lu2: ({features: {root: $}}) => [
      letters.plain.consonant.t,
      separateContext($[0], `affected`),
      letters.plain.vowel.i,
      separateContext($[1], `affected`),
      separateContext($[2], `affected`),
      letters.plain.vowel.u,
      separateContext($[3], `affected`),
    ],
  },
  {
    tfa3la2: {
      spec: ({masdar}) => masdar(features => features.shape.tfa3la2),
    },
    fa3la2: {
      spec: ({masdar}) => masdar(features => features.shape.fa3la2),
    },
  }
);
