import {rulePack} from '/lib/rules';

import {underlying} from '/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [],
  {
    spec: ({pronoun}) => pronoun(features => features.person.third),
    env: {},
  }
);
