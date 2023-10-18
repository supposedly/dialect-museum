import {templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({verb}) => verb({
      door: `fa3vl`,
      theme: `i`,
      tam: `past`,
      root: {length: 3},
    }),
  }
);
