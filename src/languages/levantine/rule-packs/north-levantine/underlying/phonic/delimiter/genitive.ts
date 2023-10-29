import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({delimiter}) => delimiter(`genitive`),
    env: {},
  },
  {
    default: [{type: `boundary`, features: {type: `morpheme`}, context: {affected: false}}],
  }
);
