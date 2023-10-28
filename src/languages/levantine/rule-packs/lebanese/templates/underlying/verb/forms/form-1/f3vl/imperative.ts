import ruleset from './ruleset';
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
      // preject doesn't invalidate a tracker node from being touched again
      $i: [operations.preject(letters.plain.consonant.$, letters.plain.vowel.i)],
      none: [],
    },
    body: {
      f3vvl: ({features: {root: $, theme}}) => [
        separateContext($[0], `affected`),
        separateContext($[1], `affected`),
        letters.plain.vowel[themeMap[theme]],
        separateContext($[2 as number], `affected`),
        // `as number` to stop it from making $[2]'s only value the `{weak: false}` thing
        // from this ruleset's spec...
        // maybe i could do some special processing on array values to merge those with the
        // `[x: number]` index signature
        // if so that same processing could also fix the iterator bug :/
      ],
      f3vl: [operations.mock({features: {tam: `subjunctive`}})],
    },
  }),
  {
    hasAffix: {
      match: `any`,
      value: [
        {
          target: {
            env: ({before}, {vowel}) => before(vowel()),
          },
        },
        {
          env: ({before}, {delimiter}) => before(delimiter()),
        },
      ],
    },
    defective: {
      spec: ({verb}) => verb((features, traits) => traits.defective),
    },
  }
);
