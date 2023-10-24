import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({verb}) => verb({}, context => context.affected(false)),
    env: {},
  },
  operations => ({
    default: [
      operations.mock({features: {door: `f3vl`, theme: `i`}}),
    ],
  })
);
