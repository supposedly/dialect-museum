import {finalize} from '/lib/rules';

import underlying from './ruleset';

import pronoun from './pronoun';
import cleanup from './cleanup';
import contractableLongVowel from './contractable-long-vowel';
import daad from './daad';
import r from './r';

export default finalize(
  // pronoun going first is crucial
  underlying.pack({
    pronoun,
    cleanup,
    contractableLongVowel,
    daad,
    r,
  }),
);
