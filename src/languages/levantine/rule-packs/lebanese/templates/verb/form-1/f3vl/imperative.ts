import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

type Doubles<T extends string> = T extends unknown ? `${T}${T}` : never;

export default ruleset(
  {
    spec: ({verb}) => verb(
      (features, traits) => ({match: `all`, value: [
        features.tam.imperative,
        {root: {2: {weak: false}}},
      ]})
    ),
    env: {},
  },
  operations => ({
    prefix: {
      $i: [operations.preject(letters.plain.consonant.$, letters.plain.vowel.i)],  // preject shouldn't invalidate a tracker node from being touched again
      none: [],  // think i need this to circumvent default lol will see abt changing how that works
    },
  })
);
