import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.gender.feminine),
    env: {},
  },
  operations => ({
    base: {
      hii: [letters.plain.consonant.h, letters.plain.vowel.ii],
    },
    ending: {
      ye: [operations.postject(letters.plain.consonant.y, letters.plain.vowel.e)],
    },
  })
);
