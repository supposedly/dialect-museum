import ruleset from './ruleset';

export default ruleset(
  {
    spec: {features: {long: true}},
    env: {},
  },
  {
    default: c => [{...c, features: {...c.features, long: false}}],
  }
);
