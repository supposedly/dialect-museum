const {fenum} = require(`../../enums`);

const dep = fenum([
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

module.exports = {
  dep,
};
