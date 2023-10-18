import ruleset from './base';

export default ruleset(
  {
    spec: {features: {}, context: {affected: {match: `type`, value: `boolean`}}},
    env: {},
  },
  operations => ({
    default: ({features: {subject: features}, context}) => [
      operations.preject({type: `pronoun`, features, context}),
      operations.postject({type: `pronoun`, features, context}),
    ],
  })
);
