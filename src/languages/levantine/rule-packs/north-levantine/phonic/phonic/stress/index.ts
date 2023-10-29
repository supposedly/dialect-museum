import stress from './ruleset';

import morphology from './morphology';
import superheavy from './superheavy';
import heavyPenult from './heavy-penult';
import antepenult from './antepenult';
import lightAntepenultCleanup from './light-antepenult-cleanup';

export default stress.pack({
  morphology,
  superheavy,
  heavyPenult,
  antepenult,
  lightAntepenultCleanup,
});
