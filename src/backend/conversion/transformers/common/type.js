import {fenum} from '../../enums';

export const depType = fenum([
  /* constant dependencies */
  `word`,
  `type`,
  /* reactive dependencies */
  `prev`,
  `next`,
  `prevConsonant`,
  `nextConsonant`,
  `prevVowel`,
  `nextVowel`,
]);

export const transformType = fenum([
  `transformation`,
  `expansion`,
  `promotion`,
]);
