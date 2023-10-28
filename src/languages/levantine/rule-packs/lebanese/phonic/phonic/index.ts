import phonic from './ruleset';

import syllable from './syllable';
import stress from './stress';
import cvcc from './cvcc';

export default phonic.pack({
  syllable,
  stress,
  cvcc,
});
