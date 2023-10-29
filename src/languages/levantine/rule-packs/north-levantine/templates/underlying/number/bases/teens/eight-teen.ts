import ruleset from '../../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 8}},
    env: {},
    was: {
      templates: {
        spec: ({number}) => number({value: 18}),
      },
    },
  },
  {
    default: [
      letters.plain.consonant.th,
      letters.plain.consonant.m,
      letters.plain.vowel.a,
      letters.plain.consonant.n,
    ],
  }
);
