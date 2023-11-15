import {finalize} from 'src/lib/rules';

import display from './ruleset';

import consonant from './consonant';
import vowel from './vowel';
import diphthong from './diphthong';
import literal from './literal';
import boundary from './boundary';

export default finalize(
  display.pack({
    consonant,
    vowel,
    diphthong,
    literal,
    boundary,
  }),
);
