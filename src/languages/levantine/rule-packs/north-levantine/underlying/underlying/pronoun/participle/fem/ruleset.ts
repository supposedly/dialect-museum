import {rulePack} from 'src/lib/rules';

import {underlying, templates} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: ({pronoun}) => pronoun({gender: `feminine`}),
    env: ({before}, {boundary, delimiter}) => (
      {
        match: `any`,
        value: [
          before(boundary((features, traits) => traits.suprasyllabic)),
          before(delimiter()),
        ],
      }
    ),
    was: {templates: {spec: {type: `participle`}}},
  }
);
