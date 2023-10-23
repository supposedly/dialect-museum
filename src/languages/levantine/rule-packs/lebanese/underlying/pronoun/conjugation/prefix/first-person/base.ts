import {rulePack} from '/lib/rules';

import {underlying, templates} from '/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`, features: {person: `first`}},
    env: ({after}, {boundary, affix}) => after({
      match: `any`,
      value: [
        boundary(),
        affix(features => features.symbol.indicative),
      ],
    }),
    was: {templates: {spec: {type: `verb`}}},
  }
);
