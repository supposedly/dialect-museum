import ruleset from './ruleset';

export default ruleset(
  {
    spec: {type: `diphthong`, features: {}, context: {}},
    env: {},
  },
  {
    default: ({features: {first, second}}) => [
      {type: `literal`, features: {value: first.height === `low` ? `a` : `e`}, context: {capitalized: false}},
      {type: `literal`, features: {value: second.round ? `w` : `y`}, context: {capitalized: false}},
    ],
  }
);
