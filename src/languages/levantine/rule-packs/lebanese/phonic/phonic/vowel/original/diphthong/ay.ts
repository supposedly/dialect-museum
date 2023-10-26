import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

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
  },
  {
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant(), [1])),
    },
    inVerbSuffix: {
      was: {templates: {spec: {type: `verb`}}},
    },
    in2af3al: {
      was: {templates: {spec: ({special}) => special({shape: `af3al`})}},
    },
  }
);
