import phonic from './ruleset';

import delimiter from './delimiter';
import affix from './affix';
import vowel from './vowel';
import consonant from './consonant';

// consonant & vowel coming last is crucial
export default phonic.pack({
  delimiter,
  affix,
  vowel,
  consonant,
});
