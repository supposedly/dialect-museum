import ruleset from '../ruleset';

export default ruleset(
  {
    spec: {type: `pronoun`},
    env: ({before, after}, {boundary}) => ({match: `all`, value: [before({match: `not` as never, value: boundary()}), after({match: `not` as never, value: boundary()})]}) as never,
  },
  {
    default: [],
  }
);
