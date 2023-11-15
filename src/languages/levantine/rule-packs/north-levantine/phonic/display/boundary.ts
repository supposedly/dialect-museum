import ruleset from './ruleset';

export default ruleset(
  {
    spec: {type: `boundary`, features: {}},
    env: {},
  },
  {
    default: ({features: {type}}) => type === `syllable` ? [
      {type: `literal`, features: {value: `.`}, context: {capitalized: false}},
    ] : [],
  }
);
