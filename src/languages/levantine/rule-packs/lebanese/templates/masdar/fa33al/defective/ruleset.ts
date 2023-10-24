import {templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({masdar}) => masdar((features, traits) => ({
      match: `all`,
      value: [
        features.shape.fa33al,
        traits.defective,
      ],
    })),
    env: {},
  }
);
