import {rulePack} from '/lib/rules';
import {underlying} from '/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [],
  {
    spec: {type: `pronoun`},
    env: ({after}, {delimiter}) => after(delimiter()),
  }
);
