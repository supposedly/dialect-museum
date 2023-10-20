import affected from './base';

import defective from './defective';
import other from './other';

export default affected.pack({
  defective,
  other,
});
