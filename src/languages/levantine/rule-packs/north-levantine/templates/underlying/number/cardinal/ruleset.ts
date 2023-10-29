import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({number}) => number({type: `cardinal`}),
    env: {},
  }
);
