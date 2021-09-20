import { fenum } from '../enums';

export * as obj from './obj';
export { default as choice } from './choice';

export const type = fenum([
  // XXX: it's important (as long as i'm using this hack enum func) for `suffix` to
  // remain at position 0 here, just like in the segment-type enum over in /parsing
  // (what's actually important is that this type.suffix and that type.suffix have the same index but same diff)
  // the reason it's important is in word.js
  `suffix`,
  `consonant`,
  `vowel`,
  `epenthetic`,
  `modifier`,
  `delimiter`,
]);
