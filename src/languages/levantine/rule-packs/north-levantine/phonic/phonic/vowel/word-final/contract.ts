import ruleset from './ruleset';

export default ruleset(
  {
    spec: {features: {long: true}},
    // nsaa, shii, shuu, etc!
    env: ({after}, {boundary, consonant}) => (
      after(boundary.seek(`syllable`, {}, {match: `any`, value: [boundary(`morpheme`), consonant()]}))
    ),
  },
  {
    // default: operations.mock({features: {long: false}}),
    default: c => [{...c, features: {...c.features, long: false}}],
  }
);
