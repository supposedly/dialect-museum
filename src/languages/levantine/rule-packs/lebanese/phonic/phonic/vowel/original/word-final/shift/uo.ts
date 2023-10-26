import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: ({vowel}) => vowel({round: true}, {affected: false}),
  },
  {
    o: [letters.plain.vowel.o],
    u: [letters.plain.vowel.u],
    au: [
      {
        type: `diphthong`,
        features: {
          first: letters.plain.vowel.a.features,
          second: letters.plain.vowel.u.features,
        },
        context: {affected: false},
      },
    ],
  },
  {
    isU: {
      spec: letters.plain.vowel.u,
    },
    isO: {
      spec: letters.plain.vowel.o,
    },
    inPause: {
      env: ({before}, {boundary}) => before(boundary((features, traits) => traits.pausal)),
    },
  }
);
