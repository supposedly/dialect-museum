import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: ({diphthong}) => diphthong({second: letters.plain.vowel.u.features}),
  },
  {
    ow: [
      {
        type: `diphthong`,
        features: {first: letters.plain.vowel.o.features, second: letters.plain.vowel.u.features},
        context: {affected: false},
      },
    ],
    oo: [letters.plain.vowel.oo],
    a: ({features: {first}, context}) => [{type: `vowel`, features: first, context}],
  },
  {
    inPause: {
      env: ({before}, {boundary}) => before(boundary((features, traits) => traits.pausal)),
    },
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant(), [1])),
    },
    in2af3al: {
      was: {templates: {spec: ({special}) => special({shape: `af3al`})}},
    },
  }
);
