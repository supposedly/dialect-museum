import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.number.plural),
    env: {},
  },
  {
    // yes i could preject the initial letter, no i'm not gonna bother :]
    ni7na: [
      letters.plain.consonant.n,
      letters.plain.vowel.i,
      letters.plain.consonant.x,
      letters.plain.consonant.n,
      letters.plain.vowel.aa,
    ],
    i7na: [
      letters.plain.consonant.$,
      letters.plain.vowel.i,
      letters.plain.consonant.x,
      letters.plain.consonant.n,
      letters.plain.vowel.aa,
    ],
    li7na: [
      letters.plain.consonant.l,
      letters.plain.vowel.i,
      letters.plain.consonant.x,
      letters.plain.consonant.n,
      letters.plain.vowel.aa,
    ],
    ri7na: [
      letters.plain.consonant.r,
      letters.plain.vowel.i,
      letters.plain.consonant.x,
      letters.plain.consonant.n,
      letters.plain.vowel.aa,
    ],
  }
);
