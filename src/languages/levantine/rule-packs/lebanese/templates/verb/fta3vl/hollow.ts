import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => ({
      match: `all`,
      value: [
        features.door.nfa3vl,
        traits.hollow,
      ],
    })),
  },
  operations => ({
    // could mock `fa3il` instead of `fa3al` below, same diff bc hollow!
    // (this is why i need a feature tree :( should mock `fa3vl` instead)
    medial: {
      a: [
        operations.preject(letters.plain.consonant.t),
        operations.mock({features: {door: `fa3al`, theme: `a`}}),
      ],
      i: [
        operations.preject(letters.plain.consonant.t),
        operations.mock({features: {door: `fa3al`, theme: `i`}}),
      ],
    },
  }),
);
