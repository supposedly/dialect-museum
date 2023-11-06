import {rulePack} from 'src/lib/rules';

import {templates, underlying} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: ({pronoun}) => pronoun({person: `third`, number: `singular`}),
    env: {},
    was: {
      templates: {
        spec: {type: `pronoun`},
      },
    },
  }
);
