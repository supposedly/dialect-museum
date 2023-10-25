// lol i guess this is literally only for the word Dallne? dunno about 7allne and stuff too
import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({delimiter}) => delimiter(`pseudosubject`),
    env: {},
  },
  {
    default: [{type: `boundary`, features: {type: `morpheme`}, context: {affected: false}}],
  }
);
