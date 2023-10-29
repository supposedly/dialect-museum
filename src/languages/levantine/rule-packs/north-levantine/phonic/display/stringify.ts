import ruleset from './ruleset';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    default: c => [{type: `literal`, features: {value: JSON.stringify(c)}}],
  }
);
