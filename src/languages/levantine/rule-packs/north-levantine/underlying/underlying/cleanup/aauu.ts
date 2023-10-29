import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: letters.plain.vowel.aa,
    env: {next: [{spec: letters.plain.vowel.uu}]},
  },
  operations => ({
    aw: [operations.coalesce([letters.plain.vowel.a, letters.plain.consonant.w])],
    uu: [],
  })
);
