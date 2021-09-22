import { fenum } from '../enums';

export * as obj from './obj';
export { default as choice } from './choice';

export const type = fenum([
  // XXX: it's important (as long as i'm using this hack enum func) for `suffix` and `prefix` and `augmentation` to
  // remain at position 0 in this order, just like in the object-type enum over in /parsing
  // (what's actually important is just that they have the same indices but w/e)
  // the reason it's important is in word.js
  `suffix`,
  `prefix`,
  `augmentation`,
  `consonant`,
  `vowel`,
  `epenthetic`,
  `modifier`,
  `delimiter`,
]);
