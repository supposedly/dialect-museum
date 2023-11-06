import {rulePack} from 'src/lib/rules';

import {templates, underlying} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: ({pronoun}) => pronoun(features => features.person.third),
    env: {},
    was: {
      templates: {
        spec: {type: `pronoun`},
      },
    },
  }
);
