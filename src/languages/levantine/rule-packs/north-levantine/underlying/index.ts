import {underlying as source, templates} from 'src/languages/levantine/alphabets';

import underlying from './underlying';
import phonic from './phonic';

export default {
  rulePacks: {
    underlying,
    phonic,
  },
  source,
  dependencies: [templates],
};
