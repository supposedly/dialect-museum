import ruleset from './ruleset';
import {withFlags} from 'src/languages/levantine/alphabets/templates/templates';
import {letters, underlying} from 'src/languages/levantine/alphabets/underlying';
import {fixRoot} from '../../number/ordinal/ruleset';

export default ruleset(
  {
    spec: {
      features: {
        string: [
          {type: `consonant`, features: underlying.types.consonant, context: underlying.context},
          letters.plain.vowel.a,
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
          shape: `fa3ale`,
          root: fixRoot([$[0], $[2], $[4]]),
        },
      }),
    ],
  })
);
