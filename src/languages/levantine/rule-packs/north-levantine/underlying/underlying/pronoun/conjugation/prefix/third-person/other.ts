import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    default: [
      letters.plain.consonant.y,
      letters.plain.vowel.i,
    ],
  }
);
