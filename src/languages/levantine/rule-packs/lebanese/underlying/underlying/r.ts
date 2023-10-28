import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: letters.plain.consonant.r,
    env: {},
  },
  operations => ({
    emphatic: [operations.mock(({consonant}) => consonant(features => features.emphatic()))],
    plain: [operations.mock(({consonant}) => consonant(features => features.emphatic(false)))],
  }),
  {
    afterLongII: {
      env: ({after}) => after(letters.plain.vowel.ii),
    },
    directlyAfterShortI: {
      env: ({after}) => after(letters.plain.vowel.i),
    },
    afterShortI: {
      env: ({after}, {vowel}) => after(vowel.seek(letters.plain.vowel.ii.features, {}, {type: `consonant`})),
    },
    // like 2araanib
    beforeUmlaut: {
      env: ({before}, {consonant, vowel}) => before(
        letters.plain.vowel.aa,
        consonant({emphatic: false}),
        // either i or ii
        vowel({height: `high`, backness: `front`, round: false}),
      ),
    },
    beforeEmphaticUmlaut: {
      env: ({before}, {consonant, vowel}) => before(
        letters.plain.vowel.aa,
        consonant({emphatic: true}),
        // either i or ii
        vowel({height: `high`, backness: `front`, round: false}),
      ),
    },
    // like maariq
    inUmlaut: {
      env: ({after, before}, {vowel}) => ({
        ...after(letters.plain.vowel.aa),
        // either i or ii
        ...before(vowel({height: `high`, backness: `front`, round: false})),
      }),
    },
    wasPlain: {
      was: {
        underlying: {
          spec: {features: {emphatic: false}},
        },
      },
    },
  }
);
