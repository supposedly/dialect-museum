import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({delimiter}) => delimiter(`object`),
    env: {},
  },
  {
    default: [{type: `boundary`, features: {type: `morpheme`}, context: {affected: false}}],
  }
);
