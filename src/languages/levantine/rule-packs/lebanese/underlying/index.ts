import underlying from './underlying';
import phonic from './phonic';
import {finalize} from '/lib/rules';

export default {
  underlying: finalize(underlying),
  phonic: finalize(phonic),
};
