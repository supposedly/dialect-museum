const obj = require(`./obj`);
const choice = require(`./choice`);
const {fenum} = require(`../enums`);

const type = fenum([
  `consonant`,
  `vowel`,
  `epenthetic`,
  `suffix`,
  `modifier`,
  `delimiter`,
]);

module.exports = {
  obj,
  choice,
  type,
};
