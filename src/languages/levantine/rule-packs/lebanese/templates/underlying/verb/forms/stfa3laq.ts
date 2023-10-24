import ruleset from '../ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({door: `stfa3la2`}),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.s),
      operations.mock(({verb}) => verb({door: `tfa3la2`, tam: `past`})),
    ],
  })
);
