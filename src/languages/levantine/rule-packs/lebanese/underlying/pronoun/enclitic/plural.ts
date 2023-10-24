import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({number: `plural`, person: {match: `any`, value: [`second`, `third`]}}),
    env: {},
  },
  operations => ({
    um: [operations.postject(letters.plain.vowel.u, letters.plain.consonant.m)],
    un: [operations.postject(letters.plain.vowel.u, letters.plain.consonant.n)],
    in: [operations.postject(letters.plain.vowel.i, letters.plain.consonant.n)],
  }),
  {
    secondPerson: {
      spec: ({pronoun}) => pronoun(features => features.person.second),
    },
    thirdPerson: {
      spec: ({pronoun}) => pronoun(features => features.person.third),
    },
    masculine: {
      spec: ({pronoun}) => pronoun(features => features.gender.masculine),
    },
    feminine: {
      spec: ({pronoun}) => pronoun(features => features.gender.feminine),
    },
  }
);
