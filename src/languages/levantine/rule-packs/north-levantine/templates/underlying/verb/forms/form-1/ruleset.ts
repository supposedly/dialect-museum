import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

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
