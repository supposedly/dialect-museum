import ruleset from './ruleset';

export default ruleset(
  {
    spec: {features: {}, context: {affected: {match: `type`, value: `boolean`}}},
    env: {},
    was: {templates: {spec: {type: `verb`}}},   // filter out participles mocking verb shapes
  },
  operations => ({
    conjugation: ({features: {subject: features}, context}) => console.log(`conjugating`) || [
      operations.preject({type: `pronoun`, features, context}),
      operations.postject({type: `pronoun`, features, context}),
    ],
  })
);
