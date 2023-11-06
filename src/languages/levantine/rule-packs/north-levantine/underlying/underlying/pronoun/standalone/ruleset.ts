import {rulePack} from 'src/lib/rules';

import {templates, underlying} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`},
    env: {},
    was: {
      templates: {
        spec: {type: `pronoun`},
      },
    },
  }
);
