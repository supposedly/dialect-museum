import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({person: `second`}),
    env: {},
  },
  operations => ({
    // this would yield stuff like mxalli(y)itni => mxall(y)itni or something? and mxallaitni => mxallitni
    it: [operations.mock(letters.plain.vowel.i, letters.plain.consonant.t)],
    iit: [operations.mock(letters.plain.vowel.ii, letters.plain.consonant.t)],
    // this would yield stuff like mxalliiyitni, mxallaayitni
    taMarbouta: [operations.mock(({affix}) => affix(`f`))],
  })
);
