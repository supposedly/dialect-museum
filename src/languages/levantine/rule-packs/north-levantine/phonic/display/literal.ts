import ruleset from './ruleset';

export default ruleset(
  {
    spec: {type: `literal`},
    env: {},
  },
  {
    default: c => [c],
  }
);
