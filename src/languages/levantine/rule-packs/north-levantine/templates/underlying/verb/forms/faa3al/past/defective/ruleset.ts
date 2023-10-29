import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({verb}) => verb((features, traits) => ({
      match: `all`,
      value: [
        traits.defective,
        features.door.faa3al,
        features.tam.past,
      ]})),
    env: {},
  }
);
