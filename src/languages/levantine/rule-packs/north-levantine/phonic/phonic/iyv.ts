import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.consonant.y,
    env: ({after, before}, {vowel}) => ({
      ...after(letters.plain.vowel.i),
      ...before(vowel()),
    }),
  },
  operations => ({
    geminate: c => [operations.postject(c)],
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
  }
);
