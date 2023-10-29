import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({verb}) => verb({
      door: `f3vl`,
      tam: {match: `any`, value: [`imperative`, `indicative`, `subjunctive`]},
      root: {length: 3},
    }),
    env: {},
  }
);
