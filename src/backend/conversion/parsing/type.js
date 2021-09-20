import { fenum } from '../enums';

export default fenum([
  // XXX: it's important (as long as i'm using this hack enum func) for `suffix` to
  // remain at position 0 here, just like in the segment-type enum over in ../objects
  // (what's actually important is that this type.suffix and that type.suffix have the same index but same diff)
  // the reason it's important is in word.js
  `suffix`,
  `augmentation`,
  `pronoun`,
  `stem`,
  `word`,
  `syllable`,
  // tag types
  `pp`,
  `verb`,
  `l`,
  `idafe`,
  `tif3il`,
  `af3al`,
  `number`,
]);
