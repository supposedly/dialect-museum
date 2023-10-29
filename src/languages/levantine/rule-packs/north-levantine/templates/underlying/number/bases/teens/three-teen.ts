import ruleset from '../../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 3}},
    env: {},
    was: {
      templates: {
        spec: ({number}) => number({value: 13}),
      },
    },
  },
  {
    thlatht: [
      letters.plain.consonant.th,
      letters.plain.consonant.l,
      letters.plain.vowel.a,
      letters.plain.consonant.th,
    ],
    tlatt: [
      letters.plain.consonant.t,
      letters.plain.consonant.l,
      letters.plain.vowel.a,
      letters.plain.consonant.t,
    ],
    tnatt: [
      letters.plain.consonant.t,
      letters.plain.consonant.n,
      letters.plain.vowel.a,
      letters.plain.consonant.t,
    ],
  }
);
