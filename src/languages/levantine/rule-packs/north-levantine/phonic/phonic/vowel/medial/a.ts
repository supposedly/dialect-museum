import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.vowel.a,
    env: {},
  },
  {
    i: [letters.plain.vowel.i],
    I: [letters.plain.vowel.ɪ],
    e: [letters.plain.vowel.e],
  },
  {
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant())),
    },
    unstressedOpen: {
      spec: ({vowel}) => vowel({stressed: false}),
      env: ({before}, {boundary}) => before(boundary(`syllable`)),
    },
    // this goes before aa -> ee i guess
    beforeStressedA: {
      env: ({before}, {vowel, boundary, consonant}) => before(
        vowel.seek(
          {
            match: `any`, value: [
              {...letters.plain.vowel.a.features, stressed: true},
              {...letters.plain.vowel.aa.features, stressed: true},
            ],
          },
          {},
          {
            match: `any`,
            value: [
              boundary(`syllable`),
              consonant(),
            ],
          }
        )
      ),
    },
  }
);
