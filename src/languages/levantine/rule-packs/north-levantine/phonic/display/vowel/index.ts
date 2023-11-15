import consonant from './ruleset';

import * as letters from './letters';
import long from './long';
import stressed from './stressed';

export default consonant.pack({
  // long,
  // stressed,
  ...letters,
});
