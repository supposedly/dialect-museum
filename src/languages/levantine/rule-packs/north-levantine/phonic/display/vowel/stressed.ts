import ruleset from './ruleset';

export default ruleset(
  {
    spec: {
      features: {
        long: true,
      },
    },
    env: {},
  },
  operations => ({
    // combining acute
    default: [
      // operations.preject(
      //   {type: `literal`, features: {value: `(`}, context: {capitalized: false}},
      // ),
      operations.postject(
        {type: `literal`, features: {value: `\u0301`}, context: {capitalized: false}},
        // {type: `literal`, features: {value: `)`}, context: {capitalized: false}},
      ),
    ],
  })
);
