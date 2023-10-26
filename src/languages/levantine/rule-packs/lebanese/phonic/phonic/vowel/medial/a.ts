import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

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
    // TODO: stress
    unstressedOpen: {
      env: ({before}, {boundary}) => before(boundary(`syllable`)),
    },
    // TODO: stress
    // this goes before aa -> ee i guess
    beforeStressedA: {
      env: ({before}, {vowel, boundary, consonant}) => before(
        vowel.seek(
          {
            match: `any`, value: [
              letters.plain.vowel.a.features,
              letters.plain.vowel.aa.features,
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
