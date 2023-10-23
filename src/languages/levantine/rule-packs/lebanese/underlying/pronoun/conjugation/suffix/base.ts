import {rulePack} from "/lib/rules";

import {underlying, templates} from '/languages/levantine/alphabets';

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
          boundary(),
          delimiter(),
        ],
      })
    ),
    was: {templates: {spec: {type: `verb`}}},
  }
);
