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
    wasPlain: {
      was: {
        underlying: {
          spec: {features: {emphatic: false}},
        },
      },
    },
  }
);
