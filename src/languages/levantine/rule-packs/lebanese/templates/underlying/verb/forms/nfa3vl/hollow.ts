import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.hollow),
  },
  operations => ({
    // could mock `fa3il` instead of `fa3al` below, same diff bc hollow!
    // (this is why i need a feature tree :( should mock `fa3vl` instead)
    medial: {
      nfalC: [
        // {tam: `past`} forces CaaC voweling
        operations.preject(letters.plain.consonant.n),
        operations.mock({features: {door: `fa3al`, tam: `past`, theme: `a`}}),
      ],
      nfilC: [
        // {tam: `past`} forces CaaC voweling
        operations.preject(letters.plain.consonant.n),
        operations.mock({features: {door: `fa3al`, tam: `past`, theme: `i`}}),
      ],
    },
  }),
);
