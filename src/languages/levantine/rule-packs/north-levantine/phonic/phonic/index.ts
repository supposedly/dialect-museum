import {finalize} from 'src/lib/rules';

import phonic from './ruleset';

import iyv from './iyv';
import iyyi from './iyyi';
import yi from './yi';
import iyy from './iyy';
import indicative from './indicative';
import syllable from './syllable';
import stress from './stress';
import vowel from './vowel';
import consonant from './consonant';
import cvcc from './cvcc';

// cvcc (epenthetic) and consonant (h) going after stress & syllable is crucial
// stress going after syllable is ofc crucial
export default finalize(
  phonic.pack({
    iyv,
    iyyi,
    yi,
    iyy,
    syllable,
    stress,
    vowel,
    indicative,
    consonant,
    cvcc,
  }),
);
