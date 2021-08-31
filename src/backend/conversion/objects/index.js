import { fenum } from '../enums';

export * as obj from './obj';
export { default as choice } from './choice';

export const type = fenum([
  `consonant`,
  `vowel`,
  `epenthetic`,
  `suffix`,
  `modifier`,
  `delimiter`,
]);
