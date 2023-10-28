import underlying from './ruleset';

import pronoun from './pronoun';
import cleanup from './cleanup';
import contractLongVowel from './contract-long-vowel';

// pronoun going first is crucial
export default underlying.pack({
  pronoun,
  cleanup,
  contractLongVowel,
});
