import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    ending: {
      a: ({features: {root}}) => {
        const [$F, $3] = root.map(r => separateContext(r, `affected`));
        return [
          $F,
          letters.plain.vowel.a,
          $3,
          letters.plain.vowel.aa,
        ];
      },
      y: ({features: {root}}) => {
        const [$F, $3] = root.map(r => separateContext(r, `affected`));
        return [
          $F,
          letters.plain.vowel.a,
          $3,
          letters.plain.consonant.y,
        ];
      },
    },
  },
  {
    // beforeConsonant: () => ({
    //   target: {
    //     env: ({before}, {consonant}) => before(consonant()),
    //   },
    // }),
    beforeVowel: () => ({
      target: {
        env: ({before}, {vowel}) => before(vowel()),
      },
    }),
  }
);
