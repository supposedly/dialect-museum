import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';
import {letters as underlying} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  operations => ({
    stressed: [operations.mock({features: {stressed: true}})],
  }),
  {
    before3ms: {
      env: ({before}, {boundary, consonant}) => before(
        boundary.seek(`morpheme`, {}, {
          match: `any`, value: [
            consonant(),
            boundary(`syllable`),
          ]}),
        {
          spec: {},
          was: {
            underlying: {
              spec: underlying.plain.pronoun.ms3,
            },
          },
        }),
    },
    inVerb: {
      was: {
        templates: {
          spec: {type: `verb`},
        },
      },
    },
    inParticiple: {
      was: {
        templates: {
          spec: {type: `participle`},
        },
      },
    },
    inFemConj: {
      was: {
        underlying: {
          spec: underlying.plain.pronoun.fs3,
        },
        templates: {
          spec: {type: `verb`},
        },
      },
    },
    isA: {
      spec: letters.plain.vowel.a,
    },
    a__Vtv: {
      env: ({after, before}, {vowel, consonant, boundary}) => ({
        match: `all`,
        value: [
          after(
            vowel.seek(letters.plain.vowel.a.features, {}, consonant()),
          ),
          before(
            consonant(),
            vowel.seek({}, {}, {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]})
          ),
        ],
      }),
    },
    aCCItv: {
      spec: letters.plain.vowel.i,
      env: ({after, before}, {vowel, consonant, boundary}) => ({
        match: `all`,
        value: [
          after(
            vowel.seek(
              letters.plain.vowel.a.features,
              {},
              {match: `any`, value: [consonant(), boundary(`syllable`)]}
            ),
          ),
          before(
            consonant(),
            vowel.seek({}, {}, {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]})
          ),
        ],
      }),
    },
    aCItv: {
      spec: letters.plain.vowel.i,
      env: ({after, before}, {vowel, consonant, boundary}) => ({
        match: `all`,
        value: [
          after(
            consonant(),
            letters.plain.vowel.a,
          ),
          before(
            consonant(),
            vowel.seek({}, {}, {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]})
          ),
        ],
      }),
    },
    iCItv: {
      spec: letters.plain.vowel.i,
      env: ({after, before}, {vowel, consonant, boundary}) => ({
        match: `all`,
        value: [
          after(
            consonant(),
            letters.plain.vowel.i,
          ),
          before(
            consonant(),
            vowel.seek({}, {}, {match: `any`, value: [boundary(`syllable`), boundary(`morpheme`)]})
          ),
        ],
      }),
    },
    Af3alatv: {
      spec: letters.plain.vowel.a,
      env: ({after}, {boundary, consonant}) => (
        after(
          boundary.seek(
            (features, traits) => traits.suprasyllabic,
            {},
            consonant()
          )
        )
      ),
      was: {
        templates: {
          spec: ({verb}) => verb({tam: `past`, subject: underlying.plain.pronoun.fs3.features}),
        },
      },
    },
  }
);
