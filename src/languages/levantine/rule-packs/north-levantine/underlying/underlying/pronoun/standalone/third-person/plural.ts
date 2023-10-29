import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.number.plural),
    env: {},
  },
  operations => ({
    base: {
      hinn: [letters.plain.consonant.h, letters.plain.vowel.i, letters.plain.consonant.n, letters.plain.consonant.n],
      hunn: [letters.plain.consonant.h, letters.plain.vowel.u, letters.plain.consonant.n, letters.plain.consonant.n],
      humm: [letters.plain.consonant.h, letters.plain.vowel.u, letters.plain.consonant.m, letters.plain.consonant.m],
    },
    ending: {
      in: [operations.postject(letters.plain.vowel.i, letters.plain.consonant.n)],
      e: [operations.postject(letters.plain.vowel.e)],
      o: [operations.postject(letters.plain.vowel.o)],
    },
  }),
  {
    masculine: {
      spec: ({pronoun}) => pronoun(features => features.gender.masculine),
    },
    feminine: {
      spec: ({pronoun}) => pronoun(features => features.gender.feminine),
    },
  }
);
