import {rulePack} from "/lib/rules";

import {templates, underlying} from '/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`},
    env: {},
  }
);
