import consonant from './ruleset';

import * as letters from './letters';
import emphatic from './emphatic';

export default consonant.pack({
  // emphatic,
  ...letters,
});
