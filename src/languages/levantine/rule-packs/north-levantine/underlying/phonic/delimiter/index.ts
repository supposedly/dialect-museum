import delimiter from './ruleset';

import dative from './dative';
import genitive from './genitive';
import object from './object';
import pseudosubject from './pseudosubject';

export default delimiter.pack({
  dative,
  genitive,
  object,
  pseudosubject,
});
