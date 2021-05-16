const { misc: { lastOf }, vowels } = require(`../utils`);

function word({
  meta: { augmentation, ...rest },
  value
}) {
  const lastSyllable = lastOf(value).value;
  // contract long vowels w/ dative L
  // TODO: extend this to -X (-sh) suffix and -jiyy
  if (augmentation.delimiter.value === `dative`) {
    // (which would be the case were it a pretransformer)
    const a = lastOf(lastSyllable, 1);
    const b = lastOf(lastSyllable);
    if (
      a.type === `vowel` && a.meta.intrinsic.length === 2 && !a.meta.intrinsic.ly.diphthongal
      && b.type === `consonant`
    ) {
      lastSyllable.splice(-2, 1, vowels.contract(a));
    }
  }
  // unfortunately have to restrict uC...#->iC...# to verbs because
  // it's not really reliable for nouns: sillum->sillimna does exist,
  // but it's more sillum->sillumo than sillmo, etc
  // otherwise there would be code for that in here instead of
  // just in the verb-initializer
  return { type: `initialized`, augmentation, ...rest };
}

module.exports = {
  word
};
