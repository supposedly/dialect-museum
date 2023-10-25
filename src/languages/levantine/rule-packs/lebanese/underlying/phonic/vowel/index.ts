import vowel from './ruleset';

import low from './low';
import midHigh from './mid-high';
import diphthong from './diphthong';

export default vowel.pack({
  low,
  midHigh,
  diphthong,
});
