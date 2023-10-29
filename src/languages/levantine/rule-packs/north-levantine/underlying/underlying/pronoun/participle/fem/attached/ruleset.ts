import {rulePack} from '/lib/rules';

import {underlying, templates} from '/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: ({pronoun}) => pronoun({gender: `feminine`}),
    env: ({before}, {delimiter}) => before(delimiter()),
    was: {templates: {spec: {type: `participle`}}},
  }
);
