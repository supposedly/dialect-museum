import {rulePack} from 'src/lib/rules';

import {underlying} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [],
  {
    spec: {type: `pronoun`, features: {person: `first`}},
    env: {},
  }
);
