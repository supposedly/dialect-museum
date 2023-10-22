import ruleset from './base';

export default ruleset(
  {
    spec: {type: `word`, features: {}},
    env: {},
  },
  {
    // fix this lmfao
    default: ({features: {value}}) => (value as unknown as ReadonlyArray<{affected: boolean}>).map(
      features => `round` in features
        ? {type: `vowel`, features, context: features.affected}
        : {type: `consonant`, features, context: features.affected}
    ) as ReadonlyArray<object>,
  }
);
