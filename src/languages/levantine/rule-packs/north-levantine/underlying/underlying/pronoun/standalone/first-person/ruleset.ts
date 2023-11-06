import {rulePack} from 'src/lib/rules';

import {templates, underlying} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`, features: {person: `first`}},
    env: {},
    was: {
      templates: {
        spec: {type: `pronoun`},
      },
    },
  }
);
