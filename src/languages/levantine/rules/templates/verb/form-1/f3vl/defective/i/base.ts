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
        {match: `any`, value: [
          features.theme.i,
          features.theme.u,  // why not yk
        ]},
        traits.defective,
        {root: {length: 3}},
        features.door.f3vl,
        traits.nonpast,
      ],
    })),
    env: {},
  }
);
