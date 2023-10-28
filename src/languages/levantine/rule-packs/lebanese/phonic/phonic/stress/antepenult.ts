import ruleset from './ruleset';

export default ruleset(
  {
    spec: {},
    env: ({before}, {consonant, vowel, boundary}) => (
      before(
        boundary.seek(`syllable`, {}, consonant()),
        boundary.seek(
          `syllable`,
          {},
          {
            match: `any`,
            value: [
              consonant(),
              vowel({stressed: false}),
            ],
          }
        ),
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
  operations => ({
    default: [operations.mock({features: {stressed: true}})],
  })
);
