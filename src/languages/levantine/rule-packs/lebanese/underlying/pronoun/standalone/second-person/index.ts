import secondPerson from './base';

import singular from './singular';
import plural from './plural';
import stem from './stem';

export default secondPerson.pack({
  stem,
  singular,
  plural,
});
