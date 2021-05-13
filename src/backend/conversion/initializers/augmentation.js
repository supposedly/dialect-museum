const { misc: { lastOf }, parseWord: { parseLetter }} = require(`../utils`);

const L = Object.freeze(parseLetter`l`);

// not sure if this and pronouns.js should return { type, meta, value } objs or not
function augmentation({
  meta: { delimiter },
  value: { person, gender, number, clitic: clitics }
}) {
  if (delimiter.value === `dative`) {
    return base => ({
      delimiter,
      pronoun: { person, gender, number },
      clitics: clitics.afterEndOf([lastOf(lastOf(base).value), L])
    });
  }
  return base => ({
    delimiter,
    pronoun: { person, gender, number },
    clitics: clitics.afterEndOf(lastOf(base).value)
  });
}

module.exports = {
  augmentation
};
