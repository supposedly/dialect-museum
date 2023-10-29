import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: ({vowel}) => vowel({round: false}, {affected: false}),
  },
  {
    e: [letters.plain.vowel.e],
    i: [letters.plain.vowel.i],
    a: [letters.plain.vowel.a],
    ai: [
      {
        type: `diphthong`,
        features: {
          first: letters.plain.vowel.a.features,
          second: letters.plain.vowel.i.features,
        },
        context: {affected: false},
      },
    ],
  },
  {
    isI: {
      spec: letters.plain.vowel.i,
    },
    isE: {
      spec: letters.plain.vowel.e,
    },
    inPause: {
      env: ({before}, {boundary}) => before(boundary((features, traits) => traits.pausal)),
    },
  }
);
