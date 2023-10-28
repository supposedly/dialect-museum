import ruleset from './ruleset';

// unstress bAhdAlato -> bAhdalato
export default ruleset(
  {
    spec: ({vowel}) => vowel({stressed: true}),
    env: ({after}, {consonant, vowel, boundary}) => (
      after(
        boundary(`syllable`),
        boundary.seek(
          (features, traits) => traits.prosodic,
          {},
          {
            match: `any`,
            value: [
              consonant(),
              vowel({stressed: true}),
            ]}
        ),
      )
    ),
  },
  operations => ({
    default: [operations.mock({features: {stressed: false}})],
  })
);
