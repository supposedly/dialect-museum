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
        {match: `any`, value: [
          features.tam.imperative,
          features.tam.indicative,
          features.tam.subjunctive,
        ]},
        features.door.f3vl,
        {root: {length: 3}},
      ],
    })),
    env: {},
  }
);
