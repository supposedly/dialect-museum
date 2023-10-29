import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({door: `tfa33al`}),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.t),
      operations.mock(({verb}) => verb({door: `fa33al`, tam: `past`})),
    ],
  })
);
