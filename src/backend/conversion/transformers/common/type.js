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
  `prevConsonant`,
  `nextConsonant`,
  `prevVowel`,
  `nextVowel`,
]);
