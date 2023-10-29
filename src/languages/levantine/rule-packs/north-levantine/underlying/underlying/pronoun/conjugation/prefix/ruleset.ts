import {rulePack} from 'src/lib/rules';

import {underlying, templates} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`},
    env: ({after}, {boundary, affix}) => (
      after({
        match: `any`,
        value: [
          boundary((features, traits) => traits.suprasyllabic),
          affix(features => features.symbol.indicative),
        ],
      })
    ),
    was: {templates: {spec: {type: `verb`}}},
  }
);
