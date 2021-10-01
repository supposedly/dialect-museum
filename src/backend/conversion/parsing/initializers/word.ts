import {contract} from '../vowels';
import {type as segType} from '../../objects';
import wordType from '../type';
import * as utils from '../../utils';
import {edit} from '../../objects/obj';

const {misc: {lastOf}} = utils;

function deSyllabify(sections) {
  sections.forEach(section => {
    if (section.type <= wordType.augmentation) {
      return;
    }
    // otherwise it's a syllable
    const nucleus = section.value.findIndex(seg => seg.type === segType.vowel);
    if (nucleus > -1) {
      section.value[nucleus] = edit(section.value[nucleus], {meta: {stressed: section.meta.stressed}});
    }
  });
  // both wordType.[suffix, prefix, augmentation] and segType.[those] have the same
  // values so this is 'safe':
  // they're interpreted as syllable-level thingies before this and they'll be
  // interpreted as segment-level thingies after this
  return sections.flatMap(
    section => (section.type <= wordType.augmentation
      ? section
      : section.value),
  );
}

export default function word({
  meta: {was, ...meta},
  value,
}) {
  return {
    type: wordType.word,
    meta: {was, ...meta},
    value: deSyllabify(value),
  };
}
