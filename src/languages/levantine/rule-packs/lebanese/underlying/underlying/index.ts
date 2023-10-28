import {finalize} from '/lib/rules';

import underlying from './ruleset';

import pronoun from './pronoun';
import cleanup from './cleanup';
import contractableLongVowel from './contractable-long-vowel';

export default finalize(
  // pronoun going first is crucial
  underlying.pack({
    pronoun,
    cleanup,
    contractableLongVowel,
  }),
);
