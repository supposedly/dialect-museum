const obj = require(`./obj`);
const choice = require(`./choice`);
const {enums: {fenum}} = require(`./utils`);

const type = fenum(
  `consonant`,
  `vowel`,
  `epenthetic`,
  `suffix`,
  `modifier`,
  `delimiter`,
);

module.exports = {
  obj,
  choice,
  type,
};
