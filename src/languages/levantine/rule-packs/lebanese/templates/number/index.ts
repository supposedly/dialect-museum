import number from './base';

import linking from './linking';
import teenSuffix from './teen-suffix';
import fem from './fem';
import bases from './bases';
import cardinal from './cardinal';
import ordinal from './ordinal';

// linking -> teenSuffix -> cardinal ordering is crucial
// as are cardinal -> bases, ordinal -> bases
export default number.pack({
  linking,
  teenSuffix,
  fem,
  cardinal,
  ordinal,
  bases,
});
