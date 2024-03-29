import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.gender.masculine),
    env: {},
  },
  operations => ({
    base: {
      huu: [letters.plain.consonant.h, letters.plain.vowel.uu],
    },
    ending: {
      we: [operations.postject(letters.plain.consonant.w, letters.plain.vowel.e)],
    },
  })
);
