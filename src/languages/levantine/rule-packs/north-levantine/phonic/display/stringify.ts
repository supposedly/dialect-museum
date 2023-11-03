import ruleset from './ruleset';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    wat: c => [{type: `literal`, features: {value: JSON.stringify(c)}}],
  }
);
