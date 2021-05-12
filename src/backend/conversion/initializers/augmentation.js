function augmentation({
  meta: { delimiter },
  value: { value: { person, gender, number, clitics }}
}) {
  // not sure if this and pronouns.js should return { type, meta, value } objs or not
  return clitics.map(clitic => ({
    delimiter,
    clitic,
    pronoun: { person, gender, number }
  }));
}

module.exports = {
  augmentation
};
