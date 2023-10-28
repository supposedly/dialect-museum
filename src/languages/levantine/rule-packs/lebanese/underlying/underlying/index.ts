import underlying from './ruleset';

import pronoun from './pronoun';
import cleanup from './cleanup';
import contractableLongVowel from './contractable-long-vowel';

// pronoun going first is crucial
export default underlying.pack({
  pronoun,
  cleanup,
  contractableLongVowel,
});
