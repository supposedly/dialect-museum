import {alphabet} from '/lib/alphabet';

export const underlying = alphabet({
  name: `underlying`,
  context: {
    affected: {match: `type`, value: `boolean`},
  },
  types: {
    boundary: {
      type: [
        `syllable`,
        `word`,
        `pause`,  // 'petite pause'
        `sentence`,  // 'grande pause'
      ],
    },
    literal: {
      value: {match: `type`, value: `string`},
    },
    consonant: {
      voiced: {match: `type`, value: `boolean`},
      emphatic: {match: `type`, value: `boolean`},
      nasal: {match: `type`, value: `boolean`},
      lateral: {match: `type`, value: `boolean`},
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
        `stop`,
      ],
    },
    vowel: {
      height: [`high`, `mid`, `low`],
      backness: [`front`, `mid`, `back`],
      round: {match: `type`, value: `boolean`},
      long: {match: `type`, value: `boolean`},
      /* tense: {match: `type`, value: `boolean`}, */
    },
    affix: {
      symbol: [
        `indicative`,
        `f`,
        `fplural`,
        `dual`,
        `plural`,
        `aynplural`,  // some dialects have a diff reflex than for dual -ayn
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
  boundary: {
    pausal: {
      type: {match: `any`, value: [`pause`, `sentence`]},
    },
    wordLevel: {
      type: {match: `any`, value: [`word`, `pause`, `sentence`]},
    },
  },
  affix: {
    plural: {
      symbol: {
        match: `any`,
        value: [`plural`, `fplural`, `aynplural`],
      },
    },
  },
  // i hate traits so much LMAO
  // can't do {match: `any`, value: [{articulator: `throat`}, {articulator: `tongue`, value: [etc]}]}
  // because i can't MatchSchemaOf the entire thing apparently for type-complexity reasons
  // neeeeeeeeeeeeeeds overhaul
  // (but in this case i think we're safe since these locations cover articulator:throat)
  consonant: {
    back: {
      location: {
        match: `any`,
        value: [
          `glottis`,
          `pharynx`,
          `uvula`,
        ],
      },
    },
  },
});
