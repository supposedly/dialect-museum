import {rulePack} from 'src/lib/rules';
import {templates, underlying} from 'src/languages/levantine/alphabets';

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
