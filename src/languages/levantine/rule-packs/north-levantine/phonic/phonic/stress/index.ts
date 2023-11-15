import stress from './ruleset';

import morphology from './morphology';
import superheavy from './superheavy';
import heavyPenult from './heavy-penult';
import antepenult from './antepenult';
import lightAntepenultCleanup from './light-antepenult-cleanup';
import unstressed from './unstressed';

export default stress.pack({
  superheavy,
  heavyPenult,
  antepenult,
  unstressed,
  lightAntepenultCleanup,
  morphology,
});
