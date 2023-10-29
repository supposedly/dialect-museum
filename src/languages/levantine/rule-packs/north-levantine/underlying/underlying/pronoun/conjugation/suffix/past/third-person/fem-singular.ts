import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({gender: `feminine`, number: `singular`}),
    env: {},
  },
  {
    it: [
      letters.plain.vowel.i,
      letters.plain.consonant.t,
    ],
    iit: [
      letters.plain.vowel.ii,
      letters.plain.consonant.t,
    ],
    at: [
      letters.plain.vowel.a,
      letters.plain.consonant.t,
    ],
  },
  {
    wordFinal: {
      env: ({before}, {boundary}) => before(boundary((features, traits) => traits.suprasyllabic)),
    },
    beforeSuffix: {
      env: ({before}, {delimiter}) => before(delimiter()),
    },
    inFi3il: {
      was: {
        templates: {
          spec: ({verb}) => verb(features => features.door.fa3il),
        },
      },
    },
  }
);
