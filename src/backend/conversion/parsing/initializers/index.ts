import type from '../type';

import af3al from './af3al';
import augmentation from './augmentation';
import idafe from './idafe';
import number from './number';
import pp from './pp';
import pronoun from './pronoun';
import tif3il from './tif3il';
import verb from './verb';
import word from './word';

export default {
  [type.af3al]: af3al,
  [type.augmentation]: augmentation,
  [type.idafe]: idafe,
  [type.number]: number,
  [type.pp]: pp,
  [type.pronoun]: pronoun,
  [type.tif3il]: tif3il,
  [type.verb]: verb,
  [type.word]: word,
};
