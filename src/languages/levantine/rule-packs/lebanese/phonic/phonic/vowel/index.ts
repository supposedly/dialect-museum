import vowel from './ruleset';

import medial from './medial';
import wordFinal from './word-final';
import original from './original';

// medial -> original is crucial bc a-before-alif > i (i think)
export default vowel.pack({
  medial,
  wordFinal,
  original,
});
