import {finalize} from 'src/lib/rules';

import templates from './ruleset';

import specialShapes from './special-shapes';
import masdar from './masdar';
import number from './number';
import participle from './participle';
import verb from './verb';
import word from './word';

export default finalize(
  templates.pack({
    specialShapes,
    masdar,
    number,
    participle,
    verb,
    word,
  }),
);
