import secondPerson from './ruleset';

import singular from './singular';
import plural from './plural';

// i COULD do this with one 'body' ruleset that always transforms to t,
// then with feminine/plural ones that postject ii/uu,
// but it doesn't really seem necessary not sure if my philosophy is changing or what
// (you could also postject uu for both 2p *and* 3p, then postject t for 2... seems more hassle
// than it's worth tho especially for non-n...u 1p dialects)
export default secondPerson.pack({
  singular,
  plural,
});
