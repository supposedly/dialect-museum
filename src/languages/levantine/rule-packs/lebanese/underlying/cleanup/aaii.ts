import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: letters.plain.vowel.aa,
    env: {next: [{spec: letters.plain.vowel.ii}]},
  },
  operations => ({
    ay: [operations.coalesce([letters.plain.vowel.a, letters.plain.consonant.y])],
    ii: [],
  })
);
