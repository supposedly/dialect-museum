import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: ({after}, {consonant}) => after(consonant(), consonant()),
  },
  operations => ({
    l: [
      operations.preject({type: `boundary`, features: {type: `morpheme`}, context: {affected: false}}),
      operations.mock(letters.plain.consonant.l),
    ],
    ill: [
      operations.preject({type: `boundary`, features: {type: `morpheme`}, context: {affected: false}}),
      operations.mock(
        letters.plain.vowel.i,
        letters.plain.consonant.l,
        letters.plain.consonant.l,
      ),
    ],
    all: [
      operations.preject({type: `boundary`, features: {type: `morpheme`}, context: {affected: false}}),
      operations.mock(
        letters.plain.vowel.a,
        letters.plain.consonant.l,
        letters.plain.consonant.l,
      ),
    ],
  }),
  {
    afterPast: {
      env: {prev: [{was: {templates: {spec: ({verb}) => verb({tam: `past`})}}}]},
    },
    afterNonpast: {
      env: {prev: [{was: {templates: {spec: ({verb}) => verb((features, traits) => traits.nonpast)}}}]},
    },
    afterA: {
      env: ({after}, {vowel}) => after(vowel(letters.plain.vowel.a.features)),
    },
  }
);
