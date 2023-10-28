import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({vowel}) => vowel({long: true}),
    env: ({before}, {consonant, delimiter, affix}) => (
      before(
        consonant(),
        {match: `any`, value: [delimiter(`dative`), affix(`jiyy`)]}
      )
    ),
  },
  operations => ({
    contracted: [operations.mock({features: {long: false}})],
  }),
  {
    inPlural: {
      was: {
        underlying: {
          spec: ({affix}) => affix(`plural`),
        },
      },
    },
    beforeDative: {
      env: ({before}, {delimiter}) => before(delimiter(`dative`)),
    },
    beforeJiyy: {
      env: ({before}, {affix}) => before(affix(`jiyy`)),
    },
  }
);
