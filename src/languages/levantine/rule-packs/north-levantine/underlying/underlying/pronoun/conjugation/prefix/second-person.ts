import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {person: `second`}},
    env: {},
  },
  {
    default: [
      letters.plain.consonant.t,
      letters.plain.vowel.i,
    ],
  }
);
