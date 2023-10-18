import {templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({verb}) => verb(
      (features, traits) => ({
        match: `all`,
        value: [
          {match: `any`, value: [
            features.door.fa3vl,
            features.door.f3vl,
          ]},
          traits.geminate,
          {root: {length: 3}},
        ],
      })
    ),
    env: {},
  }
);
