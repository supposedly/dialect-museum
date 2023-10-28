import indicative from './ruleset';

import defaultBehavior from './indicative';
import cleanup1sg from './cleanup-1sg';
import thirdPerson from './cleanup-bey';

export default indicative.pack({
  defaultBehavior,
  cleanup1sg,
  thirdPerson,
});
