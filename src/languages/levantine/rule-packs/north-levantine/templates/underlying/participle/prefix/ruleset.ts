import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

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
