import {alphabet, normalizeToMatch} from '/lib/alphabet';

const protoConsonant = normalizeToMatch({
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
});

const consonant = normalizeToMatch({
  ...protoConsonant,
  secondary: {match: `any`, value: [protoConsonant, undefined, null]},
});

const vowel = normalizeToMatch({
  height: [`high`, `mid`, `low`],
  backness: [`front`, `mid`, `back`],
  tense: {match: `type`, value: `boolean`},
  round: {match: `type`, value: `boolean`},
  long: {match: `type`, value: `boolean`},
  stressed: {match: `type`, value: `boolean`},
  color: {match: `any`, value: [consonant, undefined, null]},
});

export default alphabet({
  name: `phonic`,
  context: {},
  types: {
    boundary: {
      type: [
        `syllable`,
        `morpheme`,
        `word`,
        `pause`,  // 'petite pause'
        `sentence`,  // 'grande pause'
      ],
    },
    literal: {
      value: {match: `type`, value: `string`},
    },
    diphthong: {
      first: {match: `single`, value: vowel},
      second: {match: `single`, value: vowel},
    },
    consonant,
    vowel,
  },
}, {
  boundary: {
    pausal: {
      type: {match: `any`, value: [`pause`, `sentence`]},
    },
    suprasyllabic: {
      type: {match: `any`, value: [`word`, `pause`, `sentence`]},
    },
    prosodic: {
      type: {match: `any`, value: [`syllable`, `word`, `pause`, `sentence`]},
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
