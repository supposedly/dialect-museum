import {rulePack} from '/lib/rules';

import {underlying, templates} from '/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`},
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
