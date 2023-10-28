import vowel from './ruleset';

import diphthong from './diphthong';
import alif from './alif';
import a from './a';
import yaa from './yaa';
import waaw from './waaw';

export default vowel.pack({
  diphthong,
  a,
  alif,
  yaa,
  waaw,
});
