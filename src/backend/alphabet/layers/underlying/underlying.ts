import {alphabet} from "../../alphabet";

export const underlying = alphabet({
  name: `underlying`,
  ctx: {
    affected: {match: `guard`, value: `boolean`},
  },
  types: {
    consonant: {
      voiced: {match: `guard`, value: `boolean`},
      emphatic: {match: `guard`, value: `boolean`},
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
      // tense: {match: `guard`, value: `boolean`},
      round: {match: `guard`, value: `boolean`},
      long: {match: `guard`, value: `boolean`},
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
