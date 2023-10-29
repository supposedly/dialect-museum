import {rulePack} from 'src/lib/rules';

import {underlying, templates} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`},
    env: ({before}, {boundary, delimiter}) => (
      before({
        match: `any`,
        value: [
          boundary((features, traits) => traits.suprasyllabic),
          delimiter(),
        ],
      })
    ),
    was: {templates: {spec: {type: `verb`}}},
  }
);
