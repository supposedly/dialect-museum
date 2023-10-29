import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

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
    velarFinal: {
      spec: ({verb}) => verb({root: {2: {location: `velum`}}}),
    },
    wasMaziid: {
      was: {
        templates: {
          spec: ({verb}) => verb({
            door: {
              match: `any`,
              value: [
                `fta3vl`,
                `nfa3vl`,
              ],
            },
          }),
        },
      },
    },
  },
);
