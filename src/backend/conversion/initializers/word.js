const { misc: { lastOf }, vowels } = require(`../utils`);

function word({
  meta: { augmentation, was: type, ...rest },
  value
}) {
  const lastSyllable = lastOf(value).value;
  const a = lastOf(lastSyllable, 1);
  const b = lastOf(lastSyllable);
  // set (femsuffix).t = true with further suffixes
  if (b.type === `suffix` && a.value === `fem`) {
    a.meta.t = true;
  }
  // contract long vowels w/ dative L
  // TODO: extend this to -X (-sh) suffix and -jiyy
  if (augmentation.delimiter.value === `dative`) {
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
  return { type, meta: { augmentation, ...rest }, value };
}

module.exports = {
  word
};
