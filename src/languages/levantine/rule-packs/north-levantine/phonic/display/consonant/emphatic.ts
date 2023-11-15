import ruleset from './ruleset';

export default ruleset(
  {
    spec: {
      features: {
        emphatic: true,
      },
    },
    env: {},
  },
  operations => ({
    // combining underdot
    default: [operations.postject({type: `literal`, features: {value: `\u0323`}, context: {capitalized: false}})],
  })
);
