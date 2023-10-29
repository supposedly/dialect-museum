import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: ({diphthong}) => diphthong({second: letters.plain.vowel.i.features}),
  },
  {
    ey: [
      {
        type: `diphthong`,
        features: {first: letters.plain.vowel.e.features, second: letters.plain.vowel.i.features},
        context: {affected: false},
      },
    ],
    ee: [letters.plain.vowel.ee],
    a: ({features: {first}, context}) => [{type: `vowel`, features: first, context}],
  },
  {
    inPause: {
      env: ({before}, {boundary}) => before(boundary((features, traits) => traits.pausal)),
    },
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant(), [1])),
    },
    // coastal beet vs riddayt
    inVerbSuffix: {
      was: {templates: {spec: {type: `verb`}}},
    },
    // stuff like 2aybas 2ay2as maybe 2ayman lol
    in2af3al: {
      was: {templates: {spec: ({special}) => special({shape: `af3al`})}},
    },
  }
);
