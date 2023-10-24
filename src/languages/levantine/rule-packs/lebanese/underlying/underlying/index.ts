import underlying from './ruleset';

import pronoun from './pronoun';
import cleanup from './cleanup';

// pronoun going first is crucial
export default underlying.pack({
  pronoun,
  cleanup,
});
