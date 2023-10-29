import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.vowel.i,
    env: ({before}, {vowel}) => (
      before(
        // make sure to run this before syllable (and stress)
        letters.plain.consonant.y,
        letters.plain.consonant.y,
        vowel(),
      )
    ),
  },
  operations => ({
    coalesce: [
      operations.coalesce({
        ...letters.plain.vowel.ii,
        features: {
          ...letters.plain.vowel.ii.features,
          stress: true,
        },
      }),
    ],
  }),
  {
    wasParticiple: {
      env: {
        was: {
          templates: {
            spec: {type: `participle`},
          },
        },
      },
    },
    // idk if some dialects only geminate faa3iyye and leave mxall<i>ye alone or something
    wasFaa3iy: {
      env: {
        was: {
          templates: {
            spec: {type: `participle`},
          },
        },
      },
    },
  },
);
