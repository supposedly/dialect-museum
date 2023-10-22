import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: letters.plain.vowel.aa,
    env: {next: [{spec: letters.plain.affix.f}]},
  },
  operations => ({
    default: [operations.postject(letters.plain.consonant.y)],
  })
);
