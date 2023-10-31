import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.vowel.i,
    env: ({before}, {boundary}) => (
      before(
        // make sure to run this before syllable (and stress)
        letters.plain.consonant.y,
        letters.plain.consonant.y,
        boundary((features, traits) => traits.suprasyllabic),
      )
    ),
  },
  operations => ({
    coalesce: [operations.coalesce(letters.plain.vowel.ii)],
  }),
  {
    wasParticiple: {
      was: {
        templates: {
          spec: {type: `participle`},
        },
      },
    },
    // idk if some dialects only geminate faa3iyye and leave mxall<i>ye alone or something
    wasFaa3iy: {
      was: {
        templates: {
          spec: {type: `participle`},
        },
      },
    },
  },
);
