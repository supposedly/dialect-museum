import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

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
