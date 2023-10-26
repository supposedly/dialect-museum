import ruleset from './ruleset';
import {withFlags} from '/languages/levantine/alphabets/templates/templates';
import {letters, underlying} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {
      features: {
        string: [
          {type: `consonant`, features: withFlags(underlying.types.consonant, `affected`, `weak`)},
          letters.plain.vowel.a,
          {type: `consonant`, features: withFlags(underlying.types.consonant, `affected`, `weak`)},
          letters.plain.vowel.aa,
          {type: `consonant`, features: withFlags(underlying.types.consonant, `affected`, `weak`)},
          letters.plain.vowel.i,
          {type: `consonant`, features: withFlags(underlying.types.consonant, `affected`, `weak`)},
        ],
      }},
    env: {},
  },
  operations => ({
    default: ({features: {string: $}}) => [
      operations.mock.was.templates({
        type: `special`,
        features: {
          shape: `fa3aaliq`,
          root: [$[0].features, $[2].features, $[4].features, $[6].features],
        },
      }),
    ],
  })
);
