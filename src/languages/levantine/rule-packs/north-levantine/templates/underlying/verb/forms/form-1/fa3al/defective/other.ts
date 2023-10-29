import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    ending: {
      a: ({features: {root: $}}) => {
        return [
          separateContext($[0], `affected`),
          letters.plain.vowel.a,
          separateContext($[1], `affected`),
          letters.plain.vowel.aa,
        ];
      },
      y: ({features: {root: $}}) => {
        return [
          separateContext($[0], `affected`),
          letters.plain.vowel.a,
          separateContext($[1], `affected`),
          letters.plain.consonant.y,
        ];
      },
    },
  },
  {
    beforeVowel: {
      target: {
        env: ({before}, {vowel}) => before(vowel()),
      },
    },
  }
);
