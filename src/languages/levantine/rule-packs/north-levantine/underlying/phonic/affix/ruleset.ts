import {phonic, templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  underlying,
  phonic,
  [templates],
  {
    spec: {type: `affix`},
    env: {},
  }
);
