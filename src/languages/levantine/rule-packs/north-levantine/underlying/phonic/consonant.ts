import ruleset from './ruleset';

export default ruleset(
  {
    spec: {type: `consonant`},
    env: {},
  },
  {
    default: consonant => [consonant],
  }
);
