import ruleset from './ruleset';
import {withFlags} from 'src/languages/levantine/alphabets/templates/templates';
import {letters, underlying} from 'src/languages/levantine/alphabets/underlying';
import {fixRoot} from '../../number/ordinal/ruleset';

export default ruleset(
  {
    spec: {
      features: {
        string: [
          letters.plain.consonant.m,
          letters.plain.vowel.a,
          {type: `consonant`, features: underlying.types.consonant, context: underlying.context},
          {type: `consonant`, features: underlying.types.consonant, context: underlying.context},
          letters.plain.vowel.a,
          {type: `consonant`, features: underlying.types.consonant, context: underlying.context},
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
          root: fixRoot([$[2], $[3], $[5]]),
        },
      }),
    ],
  })
);
