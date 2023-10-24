import {rulePack} from '/lib/rules';
import {templates, underlying} from '/languages/levantine/alphabets';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({number}) => number({
      type: `cardinal`,
      value: {match: `custom`, value: (n: number | undefined) => (n!) > 10 && (n!) < 20},
    }),
    env: {},
  }
);
