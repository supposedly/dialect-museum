const {fenum} = require(`../enums`);

const type = fenum(
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
  `af3al`
);

module.exports = {
  type,
};
