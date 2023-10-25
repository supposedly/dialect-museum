import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

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
  }),
  {
    afterEmphatic: {
      env: ({after}, {consonant}) => after(consonant(features => features.emphatic())),
    },
    afterBackConsonant: {
      env: ({after}, {consonant}) => after(consonant((features, traits) => traits.back)),
    },
  }
);
