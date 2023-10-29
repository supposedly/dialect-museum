import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({vowel}) => vowel(
      features => features.height.low,
      {affected: {match: `type`, value: `boolean`}}
    ),
    env: {},
  },
  {
    default: ({features, context}) => [
      {type: `vowel`, features: {...features, color: null, tense: false, stressed: false}, context},
    ],
  }
);
