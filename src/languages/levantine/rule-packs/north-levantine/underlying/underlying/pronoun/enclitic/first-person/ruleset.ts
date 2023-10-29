import {rulePack} from 'src/lib/rules';
import {underlying} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [],
  {
    spec: ({pronoun}) => pronoun(features => features.person.first),
    env: ({after}, {delimiter}) => after(delimiter()),
  }
);
