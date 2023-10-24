import {alphabet, normalizeToMatch} from '/lib/alphabet';

const protoConsonant = normalizeToMatch({
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
  color: {match: `any`, value: [consonant, undefined, null]},
});

export default alphabet({
  name: `phonic`,
  context: {},
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
    diphthong: {
      first: {match: `single`, value: vowel},
      second: {match: `single`, value: vowel},
    },
    consonant,
    vowel,
  },
}, {});
