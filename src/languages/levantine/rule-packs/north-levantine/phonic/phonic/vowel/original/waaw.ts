import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    was: {underlying: {spec: letters.plain.vowel.uu}},
  },
  {
    u: [letters.plain.vowel.u],
    uu: [letters.plain.vowel.uu],
    oo: [letters.plain.vowel.oo],
    aw: [
      {
        type: `diphthong`,
        features: {
          first: letters.plain.vowel.a.features,
          second: letters.plain.vowel.u.features,
        },
        context: {affected: false},
      },
    ],
    ow: [
      {
        type: `diphthong`,
        features: {
          first: letters.plain.vowel.o.features,
          second: letters.plain.vowel.u.features,
        },
        context: {affected: false},
      },
    ],
  },
  {
    inPause: {
      env: ({before}, {boundary}) => before(boundary((features, traits) => traits.pausal)),
    },
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant(), [1])),
    },
  }
);
