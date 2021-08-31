import { contract } from '../vowels';
import { type } from '../../objects';
import utils from '../../utils';
const { misc: { lastOf } } = utils;

function deSyllabify(syllables) {
  syllables.forEach(syl => {
    const nucleus = syl.value.find(seg => seg.type === type.vowel);
    if (nucleus) {
      nucleus.meta.stressed = syl.meta.stressed;
    }
  });
  return syllables.map(syl => syl.value).flat();
}

export default function word({
  meta: {augmentation, was, ...rest},
  value,
}) {
  const lastSyllable = lastOf(value).value;
  const a = lastOf(lastSyllable, 1);
  const b = lastOf(lastSyllable);
  /*
  // set (femsuffix).t = true with further suffixes
  if (b.type === type.suffix && a.value === `fem` && !a.meta.t) {
    lastSyllable.splice(-2, 1, obj.edit(a, {meta: {t: true}}));
  }
  */
  // contract long vowels w/ dative L
  // TODO: extend this to -X (-sh) suffix and -jiyy
  if (augmentation && augmentation.delimiter.value === `dative`) {
    //             ^ gdi shoulda sucked it up and gone with typescript early on
    if (
      a.type === type.vowel && a.meta.intrinsic.length === 2 && !a.meta.intrinsic.ly.diphthongal
      && b.type === type.consonant
    ) {
      lastSyllable.splice(-2, 1, contract(a));
    }
  }
  // unfortunately have to restrict uC...#->iC...# to verbs because
  // it's not really reliable for nouns: sillum->sillimna does exist,
  // but it's more sillum->sillumo than sillmo, etc
  // otherwise there would be code for that in here instead of
  // just in the verb-initializer
  return {
    type: was,
    meta: {
      syllableCount: value.length,  // verbs add to this later when prefix is chosen
      augmentation,
      ...rest,
    },
    value: deSyllabify(value),
  };
}
