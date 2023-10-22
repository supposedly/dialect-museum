import {templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

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
