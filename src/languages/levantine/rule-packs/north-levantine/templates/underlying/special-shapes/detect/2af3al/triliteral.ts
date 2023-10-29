import ruleset from './ruleset';
import {withFlags} from '/languages/levantine/alphabets/templates/templates';
import {letters, underlying} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {
      features: {
        string: [
          letters.plain.consonant.$,
          letters.plain.vowel.a,
          {type: `consonant`, features: withFlags(underlying.types.consonant, `affected`, `weak`)},
          {type: `consonant`, features: withFlags(underlying.types.consonant, `affected`, `weak`)},
          letters.plain.vowel.a,
          {type: `consonant`, features: withFlags(underlying.types.consonant, `affected`, `weak`)},
        ],
      }},
    env: ({before}) => before(letters.plain.affix.f),
  },
  operations => ({
    default: ({features: {string: $}}) => [
      operations.mock.was.templates({
        type: `special`,
        features: {
          shape: `maf3ale`,
          root: [$[2].features, $[3].features, $[5].features],
        },
      }),
    ],
  })
);
