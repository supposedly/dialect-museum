import {rulePack} from 'src/lib/rules';
import {underlying} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [],
  {
    spec: ({pronoun}) => pronoun({person: `second`, number: `singular`}),
    env: ({after}, {delimiter}) => after(delimiter()),
  }
);
