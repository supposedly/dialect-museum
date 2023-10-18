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
          features.tam.past,
          {match: `any`, value: [
            features.door.fa3vl,
            features.door.f3vl,
          ]},
          {root: {length: 3}},
          traits.geminate,
        ],
      })
    ),
    env: {},
  }
);
