import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.defective),
  },
  {
    ending: {
      y: ({features: {root: $}}) => {
        return [
          separateContext($[0], `affected`),
          letters.plain.vowel.i,
          separateContext($[1], `affected`),
          letters.plain.vowel.i,
          letters.plain.consonant.y,
        ];
      },
      none: ({features: {root: $}}) => {
        return [
          separateContext($[0], `affected`),
          letters.plain.vowel.i,
          separateContext($[1], `affected`),
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
  },
);
