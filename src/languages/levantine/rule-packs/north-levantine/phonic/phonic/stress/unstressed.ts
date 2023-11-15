import ruleset from './ruleset';

// null -> false
export default ruleset(
  {
    spec: {},
    env: {},
  },
  operations => ({
    default: [operations.mock({features: {stressed: false}})],
  })
);
