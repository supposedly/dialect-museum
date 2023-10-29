import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {},
    env: {},
  }
);
