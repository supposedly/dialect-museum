import phonic from './ruleset';

import syllable from './syllable';
import stress from './stress';
import vowel from './vowel';
import consonant from './consonant';
import cvcc from './cvcc';

// cvcc (epenthetic) and consonant (h) going after stress & syllable is crucial
// stress going after syllable is ofc crucial
export default phonic.pack({
  syllable,
  stress,
  vowel,
  consonant,
  cvcc,
});
