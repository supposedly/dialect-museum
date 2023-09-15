import {alphabet} from "/lib/alphabet/alphabet";

export const underlying = alphabet({
  name: `underlying`,
  context: {
    affected: {match: `type`, value: `boolean`},
  },
  types: {
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
    },
    suffix: {
      value: [
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
      value: [
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
      value: {
        match: `any`,
        value: [`plural`, `fplural`, `aynplural`],
      },
    },
  },
});
