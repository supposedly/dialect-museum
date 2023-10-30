import {phonic as source, templates, underlying} from 'src/languages/levantine/alphabets';

import phonic from './phonic';
import display from './display';

export default {
  rulePacks: {
    phonic,
    display,
  },
  source,
  dependencies: [templates, underlying],
};
