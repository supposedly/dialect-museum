import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

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
