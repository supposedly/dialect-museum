import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';
import {letters as underlying} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: letters.plain.consonant.h,
    env: ({after}, {boundary, consonant, vowel, diphthong}) => (
      after({
        match: `any`,
        value: [
          consonant(),
          vowel(),
          diphthong(),
          boundary((features, traits) => traits.internal),
        ],
      })
    ),
    was: {
      underlying: {
        spec: underlying.plain.pronoun.ms3,
      },
    },
  },
  {
    deleted: [],
    w: [letters.plain.consonant.w],
    y: [letters.plain.consonant.y],
  },
  {
    is3ms: {
      was: {
        underlying: {
          spec: underlying.plain.pronoun.ms3,
        },
      },
    },
    afterVocalic: {
      env: ({after}, {consonant, vowel, diphthong, boundary}) => after({
        match: `any`,
        value: [
          vowel.seek(
            {},
            {},
            {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]}
          ),
          diphthong.seek(
            {},
            {},
            {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]}
          ),
          consonant.seek(
            {
              match: `any`,
              value: [
                letters.plain.consonant.w.features,
                letters.plain.consonant.y.features,
              ],
            },
            {},
            {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]}
          ),
        ],
      }),
    },
    afterRound: {
      env: ({after}, {consonant, vowel, diphthong, boundary}) => after({
        match: `any`,
        value: [
          vowel.seek(
            {},
            {},
            {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]}
          ),
          diphthong.seek(
            {second: {round: true}},
            {},
            {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]}
          ),
          consonant.seek(
            letters.plain.consonant.w.features,
            {},
            {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]}
          ),
        ],
      }),
    },
  }
);
