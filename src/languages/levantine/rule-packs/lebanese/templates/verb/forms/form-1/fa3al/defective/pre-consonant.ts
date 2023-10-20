import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {
      target: {
        env: ({before}, {consonant}) => before(consonant()),
      },
    },
  },
  {
    ending: {
      ay: ({features: {root: $}}) => {
        return [
          separateContext($[0], `affected`),
          letters.plain.vowel.a,
          separateContext($[1], `affected`),
          letters.plain.vowel.a,
          letters.plain.consonant.y,
        ];
      },
    },
  }
);