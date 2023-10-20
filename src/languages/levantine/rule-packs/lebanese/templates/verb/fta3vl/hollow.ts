import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.hollow),
  },
  operations => ({
    // could mock `fa3il` instead of `fa3al` below, same diff bc hollow!
    // (this is why i need a feature tree :( should mock `fa3vl` instead)
    medial: {
      ftalC: [
        // {tam: `past`} forces CaaC voweling
        operations.preject(letters.plain.consonant.t),
        operations.mock({features: {door: `fa3al`, tam: `past`, theme: `a`}}),
      ],
      ftilC: [
        // {tam: `past`} forces CaaC voweling
        operations.preject(letters.plain.consonant.t),
        operations.mock({features: {door: `fa3al`, tam: `past`, theme: `i`}}),
      ],
    },
  }),
);
