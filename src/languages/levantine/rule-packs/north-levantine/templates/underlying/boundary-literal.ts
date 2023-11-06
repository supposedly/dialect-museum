import ruleset from './ruleset';

export default ruleset(
  {
    spec: {match: `any`, value: [{type: `boundary`}, {type: `literal`}]},
    env: {},
  },
  {
    default: c => [c],
  }
);
