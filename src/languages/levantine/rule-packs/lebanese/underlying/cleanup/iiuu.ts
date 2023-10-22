import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: letters.plain.vowel.ii,
    env: {next: [{spec: letters.plain.vowel.uu}]},
  },
  {
    default: [],
  }
);
