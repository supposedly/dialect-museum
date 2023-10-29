// do i need to add an 'affected A' option to this?

import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({door: `stfa33al`}),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.s),
      operations.mock(({verb}) => verb({door: `tfa33al`})),
    ],
  })
);
