import {templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({participle}) => participle((features, traits) => ({
      match: `any`,
      value: [
        traits.bareMaziid,
        traits.maziidT,
        traits.maziidST,
      ],
    })),
    env: {},
  }
);
