import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {letters as phonic} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    // FIXME nah undo the thing where you have to omit the key (i want to write affix({symbol: `indicative`}))
    spec: ({affix}) => affix(`f`),
    env: {},
  },
  operations => ({
    e: [operations.mock(letters.plain.vowel.e)],
    i: [operations.mock(letters.plain.vowel.i)],  // (this should maybe be a phonic e->i rule not sure)
    a: [operations.mock(letters.plain.vowel.a)],
    it: [operations.mock(letters.plain.vowel.i, letters.plain.consonant.t)],
    at: [operations.mock(letters.plain.vowel.i, letters.plain.consonant.t)],
  }),
  {
    affected: {
      match: `any`,
      value: [
        {spec: {context: {affected: true}}},
        {env: ({after}, segment) => after(segment({affected: true}))},
      ],
    },
    inConstruct: {
      env: ({before}, {delimiter}) => before(delimiter(`genitive`)),
    },
    afterY: {
      env: ({after}) => after(letters.plain.consonant.y),
    },
    willBeAfterA: {
      // target bc it needs to take into account i-elision... hope that doesn't ruin anything
      target: {
        env: ({after}, {consonant, vowel, boundary}) => (
          after(
            vowel.seek(
              letters.plain.vowel.a.features,
              {},
              {
                match: `any`,
                value: [
                  consonant(),
                  boundary((features, traits) => traits.internal),
                ],
              }
            )
          )
        ),
      },
    },
    afterEmphatic: {
      env: ({after}, {consonant}) => after(consonant(features => features.emphatic())),
    },
    afterBackConsonant: {
      env: ({after}, {consonant}) => after(consonant((features, traits) => traits.back)),
    },
    afterMaf3uul: {
      was: {
        templates: {
          env: ({after}, {participle}) => (
            after(
              participle((features, traits) => ({
                match: `all`,
                value: [
                  traits.mujarrad,
                  features.voice.passive,
                ],
              }))
            )
          ),
        },
      },
    },
    afterParticiple: {
      was: {
        templates: {
          env: ({after}) => after({type: `participle`}),
        },
      },
    },
    willBeAfterFee3il: {
      target: {
        env: ({after}, {consonant, vowel, boundary}) => (
          after(
            vowel.seek(
              phonic.plain.vowel.ee.features,
              {},
              {
                match: `any`,
                value: [
                  consonant(),
                  vowel(),
                  boundary((features, traits) => traits.internal),
                ],
              }
            )
          )
        ),
      },
      was: {
        templates: {
          env: ({after}, {participle}) => (
            after(
              participle((features, traits) => ({
                match: `all`,
                value: [
                  traits.mujarrad,
                  features.voice.active,
                ],
              }))
            )
          ),
        },
      },
    },
  }
);
