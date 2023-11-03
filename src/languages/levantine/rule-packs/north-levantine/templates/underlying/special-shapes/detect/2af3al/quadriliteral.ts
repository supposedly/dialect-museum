import ruleset from './ruleset';
import {withFlags} from 'src/languages/levantine/alphabets/templates/templates';
import {letters, underlying} from 'src/languages/levantine/alphabets/underlying';
import {fixRoot} from '../../../number/ordinal/ruleset';

export default ruleset(
  {
    spec: {
      features: {
        string: [
          letters.plain.consonant.$,
          letters.plain.vowel.a,
          {type: `consonant`, features: underlying.types.consonant, context: underlying.context},
          letters.plain.vowel.a,
          {type: `consonant`, features: underlying.types.consonant, context: underlying.context},
          {type: `consonant`, features: underlying.types.consonant, context: underlying.context},
          letters.plain.vowel.a,
          {type: `consonant`, features: underlying.types.consonant, context: underlying.context},
        ],
      }},
    env: {},
  },
  operations => ({
    default: ({features: {string: $}}) => [
      operations.mock.was.templates({
        type: `special`,
        features: {
          shape: `af3al`,
          root: fixRoot([$[2], $[4], $[5], $[7]]),
        },
      }),
    ],
  })
);
