const parseWord = require(`./parseWord`);
const parseConj = require(`./parseConj`);

module.exports = {
  ...parseWord,
  ...parseConj
};
