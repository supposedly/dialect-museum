import {alphabet} from "/lib/alphabet";

export const underlying = alphabet({
  name: `underlying`,
  context: {
    affected: {match: `type`, value: `boolean`},
  },
  types: {
    boundary: {
      value: {match: `type`, value: `string`},
      spacing: [
        `before`,
        `after`,
        `around`,
      ],
      pausal: {match: `type`, value: `boolean`},
    },
    literal: {
      value: {match: `type`, value: `string`},
    },
    consonant: {
      voiced: {match: `type`, value: `boolean`},
      emphatic: {match: `type`, value: `boolean`},
      articulator: [`throat`, `tongue`, `lips`],
      location: [
        `glottis`,
        `pharynx`,
        `uvula`,
        `velum`,
        `palate`,
        `bridge`,
        `ridge`,
        `teeth`,
        `lips`,
      ],
      manner: [
        `approximant`,
        `flap`,
        `fricative`,
        `affricate`,
        `nasal`,
        `plosive`,
      ],
    },
    vowel: {
      height: [`high`, `mid`, `low`],
      backness: [`front`, `mid`, `back`],
      /* tense: {match: `type`, value: `boolean`}, */
      round: {match: `type`, value: `boolean`},
      long: {match: `type`, value: `boolean`},
      diphthong: {match: `type`, value: `boolean`},
    },
    suffix: {
      symbol: [
        `f`,
        `fplural`,
        `dual`,
        `plural`,
        `aynplural`,
        `an`,
        `iyy`,
        `jiyy`,
        `negative`,
      ],
    },
    delimiter: {
      symbol: [
        `genitive`,
        `object`,
        `pseudosubject`,
        `dative`,
      ],
    },
    pronoun: {
      person: [`first`, `second`, `third`],
      gender: [`masculine`, `feminine`, `common`],
      number: [`singular`, `dual`, `plural`],
    },
  },
}, {
  suffix: {
    plural: {
      symbol: {
        match: `any`,
        value: [`plural`, `fplural`, `aynplural`],
      },
    },
  },
});
