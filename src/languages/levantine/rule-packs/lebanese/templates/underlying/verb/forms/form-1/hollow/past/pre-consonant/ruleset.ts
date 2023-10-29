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
          traits.hollow,
          {root: {length: 3}},
          {match: `any`, value: [
            features.door.fa3al,
            features.door.fa3il,
            features.door.f3vl,
          ]},
        ],
      })
    ),
    env: {},
    target: {
      env: ({before}, {consonant}) => before(consonant()),
    },
  }
);
