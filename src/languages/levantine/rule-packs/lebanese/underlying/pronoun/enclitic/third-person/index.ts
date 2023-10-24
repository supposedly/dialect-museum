import thirdPerson from './ruleset';

import fsg from './fsg';
import msg from './msg';
import other from './other';

export default thirdPerson.pack({
  msg,
  other,
  fsg,
});
