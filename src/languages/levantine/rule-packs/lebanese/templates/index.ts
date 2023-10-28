import underlying from './underlying';
import {finalize} from '/lib/rules';

export default {
  underlying: finalize(underlying),
};
