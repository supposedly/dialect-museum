import ruleset from "../ruleset";

export default ruleset(
  {
    spec: ({vowel}) => vowel({long: false}),
    env: ({before}, {consonant, vowel, boundary}) => (
      before(consonant(), consonant(), boundary((features, traits) => traits.prosodic))
    ),
  },
  operations => ({
    elongate: [operations.mock({features: {long: true}})],
    none: [],
  }),
  {
    atWordBoundary: {
      env: ({before}, {boundary}) => before(boundary((features, traits) => traits.suprasyllabic)),
    },
    atSyllableBoundary: {
      env: ({before}, {boundary}) => before(boundary(`syllable`)),
    },
  }
);
