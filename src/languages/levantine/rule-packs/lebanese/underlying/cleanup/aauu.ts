import ruleset from '../base';
import {letters} from '/languages/levantine/alphabets/underlying';

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
