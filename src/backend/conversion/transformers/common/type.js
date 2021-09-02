import {fenum} from '../../enums';

export default fenum([
  /* filters */
  `isPrefix`,
  `isAugmentation`,
  /* constant dependencies */
  `idx`,
  `type`,
  `meta`,
  `wordType`,
  `wordMeta`,
  `wordContext`,
  `word`,
  /* reactive dependencies */
  `prev`,
  `next`,
  `prevConsonant`,
  `nextConsonant`,
  `prevVowel`,
  `nextVowel`,
]);
