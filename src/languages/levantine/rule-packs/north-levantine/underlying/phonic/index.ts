import {finalize} from 'src/lib/rules';

import phonic from './ruleset';

import delimiter from './delimiter';
import affix from './affix';
import vowel from './vowel';
import consonant from './consonant';
import boundaryLiteral from './boundary-literal';

export default finalize(
  // consonant & vowel coming last is crucial
  phonic.pack({
    delimiter,
    affix,
    vowel,
    consonant,
    boundaryLiteral,
  }),
);
