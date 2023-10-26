import vowel from './ruleset';

import diphthong from './diphthong';
import alif from './alif';
import yaa from './yaa';
import waaw from './waaw';

export default vowel.pack({
  diphthong,
  alif,
  yaa,
  waaw,
});
