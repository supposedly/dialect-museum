import participle from './ruleset';

import fem from './fem';
import plural from './plural';
import other from './other';

export default participle.pack({
  fem,
  plural,
  other,
});
