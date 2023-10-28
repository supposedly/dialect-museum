import ruleset from './ruleset';

export default ruleset(
  {
    match: `any`,
    value: [
      {
        spec: ({vowel}) => vowel({long: true}),
        env: ({before}, {consonant, vowel, boundary}) => (
          before(
            boundary(`syllable`),
            boundary.seek(
              (features, traits) => traits.suprasyllabic,
              {},
              {
                match: `any`,
                value: [
                  consonant(),
                  vowel({stressed: false}),
                ],
              }
            )
          )
        ),
      },
      {
        spec: ({vowel}) => vowel({long: false}),
        env: ({before}, {consonant, vowel, boundary}) => (
          before(
            consonant(),
            boundary(`syllable`),
            boundary.seek(
              (features, traits) => traits.suprasyllabic,
              {},
              {
                match: `any`,
                value: [
                  consonant(),
                  vowel({stressed: false}),
                ],
              }
            )
          )
        ),
      },
    ],
  },
  operations => ({
    default: [operations.mock({features: {stressed: true}})],
  })
);
