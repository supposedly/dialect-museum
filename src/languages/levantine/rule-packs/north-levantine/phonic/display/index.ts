import {finalize} from 'src/lib/rules';

import display from './ruleset';

import stringify from './stringify';

export default finalize(
  display.pack({
    stringify,
  }),
);
