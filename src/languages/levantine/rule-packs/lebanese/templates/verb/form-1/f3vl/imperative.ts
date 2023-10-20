import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

const themeMap = {
  a: `aa`,
  i: `ee`,
  u: `oo`,
} as const;

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
      none: [],
    },
    body: {
      f3vvl: ({features: {root: $, theme}}) => [
        separateContext($[0], `affected`),
        separateContext($[1], `affected`),
        letters.plain.vowel[themeMap[theme]],
        separateContext($[2 as number], `affected`),
      ],
    },
  }),
  {
    beforePronoun: {
      target: {
        env: ({before}, {vowel}) => before(vowel()),
      },
    },
  }
);
