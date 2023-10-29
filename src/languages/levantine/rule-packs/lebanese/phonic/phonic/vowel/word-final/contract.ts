import ruleset from './ruleset';

export default ruleset(
  {
    spec: {features: {long: true}},
    // nsaa, shii, shuu, etc!
    env: ({after}, {consonant, boundary}) => (
      after(consonant.seek({}, {}, boundary(`syllable`)))
    ),
  },
  {
    default: c => [{...c, features: {...c.features, long: false}}],
  }
);
