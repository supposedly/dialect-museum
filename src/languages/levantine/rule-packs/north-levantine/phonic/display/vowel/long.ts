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
    default: [
      // operations.preject(
      //   {type: `literal`, features: {value: `(`}, context: {capitalized: false}},
      // ),
      operations.postject(
        {type: `literal`, features: {value: `ː`}, context: {capitalized: false}},
        // {type: `literal`, features: {value: `)`}, context: {capitalized: false}},
      ),
    ],
  })
);
