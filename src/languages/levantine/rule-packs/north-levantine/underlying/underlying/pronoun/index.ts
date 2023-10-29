import pronoun from './ruleset';

import participle from './participle';
import prefix from './conjugation/prefix';
import suffix from './conjugation/suffix';
import enclitic from './enclitic';
import standalone from './standalone';

// participle before suffix is crucial because of the part where fem mocks verbal -fs
// (update: oops jk it doesn't do that bc it'd have to mock.was.templates(...) and idk if
// i can actually implement that but the idea is there lol)
export default pronoun.pack({
  participle,
  prefix,
  suffix,
  enclitic,
  standalone,
});
