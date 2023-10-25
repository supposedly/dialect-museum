import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({vowel}) => vowel(
      {height: {match: `any`, value: [`mid`, `high`]}},
      {affected: {match: `type`, value: `boolean`}}
    ),
    env: {},
  },
  {
    default: ({features, context}) => [
      {type: `vowel`, features: {...features, color: null, tense: true}, context},
    ],
  }
);
