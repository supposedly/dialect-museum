import ruleset from './ruleset';

export default ruleset(
  {
    match: `any`,
    value: [
      {
        spec: ({vowel}) => vowel({long: true}),
        env: ({before}, {consonant, boundary}) => (
          before(
            boundary.seek(
              (features, traits) => traits.suprasyllabic,
              {},
              consonant()
            ),
          )
        ),
      },
      {
        spec: ({vowel}) => vowel({long: false}),
        env: ({before}, {consonant, boundary}) => (
          before(
            consonant(),
            consonant(),
            boundary((features, traits) => traits.suprasyllabic)
          )
        ),
      },
    ],
  },
  operations => ({
    default: [operations.mock({features: {stressed: true}})],
  })
);
