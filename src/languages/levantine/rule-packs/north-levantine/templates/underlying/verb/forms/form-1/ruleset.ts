import {templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({verb}) => verb({
      root: {length: 3},
      door: {match: `any`, value: [`fa3al`, `fa3il`, `f3vl`]},
    }),
    env: {},
  }
);
