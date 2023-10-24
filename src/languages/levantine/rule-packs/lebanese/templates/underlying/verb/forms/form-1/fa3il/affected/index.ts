import affected from './ruleset';

import defective from './defective';
import other from './other';

export default affected.pack({
  defective,
  other,
});
