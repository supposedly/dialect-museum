import ruleset from './ruleset';

export default ruleset(
  {
    spec: {},
    target: {
      env: ({before}, {consonant, vowel, boundary}) => (
        // environment: V / _(C...)$({CV}...)$({CV}...)#
        before(
          // boundary of this syllable
          boundary.seek(`syllable`, {}, consonant()),
          // onto boundary of next syllable
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
          // finally word boundary
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
  },
  operations => ({
    default: [operations.mock({features: {stressed: true}})],
  })
);
