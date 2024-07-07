import ruleset from './ruleset';

export default ruleset(
  {
    spec: {features: {long: true}},
    // nsaa, shii, shuu, etc!
    // env: {match: `custom`, value: v => console.log(v)! ?? true},
    env: {match: `all`, value: [{match: `custom`, value: v => !console.log(v)!}, ({after}, {boundary, consonant}) => (
      after(boundary.seek(`syllable`, {}, {match: `any`, value: [boundary(`morpheme`), consonant()]}))
    )]},
  },
  {
    // default: operations.mock({features: {long: false}}),
    default: c => [{...c, features: {...c.features, long: false}}],
  }
);
