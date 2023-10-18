import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.defective),
  },
  {
    ending: {
      y: ({features: {root}}) => {
        const [$F, $3] = root.map(r => separateContext(r, `affected`));
        return [
          $F,
          letters.plain.vowel.i,
          $3,
          letters.plain.vowel.i,
          letters.plain.consonant.y,
        ];
      },
      none: ({features: {root}}) => {
        const [$F, $3] = root.map(r => separateContext(r, `affected`));
        return [
          $F,
          letters.plain.vowel.i,
          $3,
        ];
      },
    },
  },
  {
    beforeVowel: () => ({
      target: {
        env: ({before}, {vowel}) => before(vowel()),
      },
    }),
  },

);
