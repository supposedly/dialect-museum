import ruleset from '../ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.consonant.y,
    env: ({after, before}, {consonant, boundary}) => ({
      ...after(letters.plain.vowel.e, boundary(`morpheme`)),
      ...before(consonant()),
    }),
    was: {
      underlying: {
        spec: {type: `pronoun`},
      },
    },
  },
  operations => ({
    be_: [],  // delete the y
    bii_: [operations.coalesce(letters.plain.vowel.ii, {prev: [{spec: letters.plain.vowel.e}]})],
    b_: [operations.coalesce({}, {prev: [{spec: letters.plain.vowel.e}]})],
  })
);
