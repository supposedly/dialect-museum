import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => ({
      match: `all`,
      value: [
        traits.hollow,
        features.tam.past,
      ],
    })),
  },
  operations => ({
    // could mock `fa3il` instead of `fa3al` below, same diff bc hollow!
    // (this is why i need a feature tree :( should mock `fa3vl` instead)
    medial: {
      stfalC: [
        // {tam: `past`} forces CaaC voweling with the mock trick i'm using in form-1/hollow/past/pre-consonant
        operations.mock({features: {door: `fa3al`, tam: `past`, theme: `a`}}),
      ],
      stfilC: [
        // {tam: `past`} forces CaaC voweling with the mock trick i'm using in form-1/hollow/past/pre-consonant
        operations.mock({features: {door: `fa3al`, tam: `past`, theme: `i`}}),
      ],
    },
  }),
  {
    affected: {
      spec: {context: {affected: true}},
    },
  }
);
