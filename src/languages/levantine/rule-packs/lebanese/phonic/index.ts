import display from './display';
import phonic from './phonic';
import {finalize} from '/lib/rules';

export default {
  display: finalize(display),
  phonic: finalize(phonic),
};
