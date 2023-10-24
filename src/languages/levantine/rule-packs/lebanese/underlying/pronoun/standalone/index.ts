import standalone from './ruleset';

import firstPerson from './first-person';
import secondPerson from './second-person';
import thirdPerson from './third-person';

export default standalone.pack({
  firstPerson,
  secondPerson,
  thirdPerson,
});
