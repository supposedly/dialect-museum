import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: letters.plain.vowel.ii,
    env: {next: [{spec: letters.plain.vowel.ii}]},
  },
  {
    default: [],
  }
);
