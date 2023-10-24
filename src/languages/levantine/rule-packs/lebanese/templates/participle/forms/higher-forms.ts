import ruleset from '../ruleset';

function stripPrefix<
  const Shape extends string
>(shape: Shape): Shape extends `sta${string}` ? Shape : Shape extends `t${infer S}` | `st${infer S}` ? S : Shape {
  if (shape.startsWith(`t`)) {
    return shape.slice(1) as never;
  }
  if (shape.startsWith(`sta`)) {
    return shape as never;
  }
  if (shape.startsWith(`st`)) {
    return shape.slice(2) as never;
  }
  return shape as never;
}

// remember, the ``{was: {templates: {type: `verb`}}}`` provision on verbs'
// prefix/suffix stuff prevents them from ejecting pronouns that interfere
// with participial ones
export default ruleset(
  {
    spec: ({participle}) => participle((features, traits) => traits.bareMaziid),
  },
  operations => ({
    distinctVoices: ({features: {shape, voice}}) => [
      operations.mock({
        type: `verb`,
        features: {
          door: stripPrefix(shape),
          theme: voice === `active` ? `i` : `a`,
        },
      }),
    ],
    mergedVoices: ({features: {shape}}) => [
      operations.mock({
        type: `verb`,
        features: {
          door: stripPrefix(shape),
          theme: `a`,
        },
      }),
    ],
  })
);
