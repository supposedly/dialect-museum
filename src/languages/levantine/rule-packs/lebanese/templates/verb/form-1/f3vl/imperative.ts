import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({
      tam: `imperative`,
      root: {2: {weak: false}},
    }),
    env: {},
  },
  operations => ({
    prefix: {
      $i: [operations.preject(letters.plain.consonant.$, letters.plain.vowel.i)],  // preject doesn't invalidate a tracker node from being touched again
      none: [],  // think i need this to circumvent default lol will see abt changing how that works
    },
  })
);
