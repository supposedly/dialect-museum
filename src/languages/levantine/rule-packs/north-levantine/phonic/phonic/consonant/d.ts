import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.consonant.d,
    env: {},
  },
  {
    retroflex: [
      {
        type: `consonant`,
        features: {
          articulator: `tongue`,
          location: `bridge`,  // same as sh, zh, j
          manner: `stop`,
          voiced: true,
          secondary: null,
          emphatic: false,
          lateral: false,
          nasal: false,
        },
        context: {affected: false},
      },
    ],
    flap: [letters.plain.consonant.r],
  },
  {
    intervocalic: {
      env: ({before, after}, {vowel}) => ({
        match: `all`,
        value: [
          before(vowel()),
          after(vowel()),
        ],
      }),
    },
  }
);
