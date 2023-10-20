// do i need to add an 'affected A' option to this?

import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb({door: `stfaa3al`}),
    env: {},
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.s),
      operations.mock(({verb}) => verb({door: `tfaa3al`})),
    ],
  })
);
