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
        {
          door: `fa3vl`,
          theme: `i`,
          tam: `past`,
          root: {length :3},  // i accidentally typed this and i think i like it better than what i meant
        },
      ],
    })),
  }
);
