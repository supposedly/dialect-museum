import {finalize} from '/lib/rules';

import phonic from './ruleset';

import delimiter from './delimiter';
import affix from './affix';
import vowel from './vowel';
import consonant from './consonant';

export default finalize(
  // consonant & vowel coming last is crucial
  phonic.pack({
    delimiter,
    affix,
    vowel,
    consonant,
  }),
);
