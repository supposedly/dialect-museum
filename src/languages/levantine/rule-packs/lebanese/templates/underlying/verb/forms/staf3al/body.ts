import ruleset from './ruleset';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  operations => ({
    default: ({features: {tam}}) => [
      operations.mock({
        features: {
          door: `f3vl`,
          // this is ofc hacky and would more-idiomatically be handled w diff rulesets + diff specs
          theme: tam === `past` ? `a` : `i`,
        },
      }),
    ],
  }),
);
