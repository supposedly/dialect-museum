import { contract } from '../vowels';
import { type as segType } from '../../objects';
import wordType from '../type';
import * as utils from '../../utils';
const { misc: { lastOf } } = utils;

function deSyllabify(sections) {
  sections.forEach(sec => {
    if (sec.type <= wordType.augmentation) {
      return;
    }
    // otherwise it's a syllable
    const nucleus = sec.value.find(seg => seg.type === segType.vowel);
    if (nucleus) {
      nucleus.meta.stressed = sec.meta.stressed;
    }
  });
  // both wordType.[suffix, prefix, augmentation] and segType.[those] have the same
  // values so this is 'safe':
  // they're interpreted as syllable-level thingies before this and they'll be
  // interpreted as segment-level thingies after this
  return sections.map(sec => sec.type <= wordType.augmentation ? sec : sec.value).flat();
}

export default function word({
  meta: {augmentation, was, ...meta},
  value,
}) {
  return {
    type: was || wordType.word,
    meta,
    value: deSyllabify(value),
  };
}
