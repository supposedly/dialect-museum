import pronoun from './ruleset';

import prefix from './conjugation/prefix';
import suffix from './conjugation/suffix';
import enclitic from './enclitic';
import standalone from './standalone';

export default pronoun.pack({
  prefix,
  suffix,
  enclitic,
  standalone,
});
