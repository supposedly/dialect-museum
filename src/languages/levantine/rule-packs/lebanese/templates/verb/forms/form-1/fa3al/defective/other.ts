import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

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
