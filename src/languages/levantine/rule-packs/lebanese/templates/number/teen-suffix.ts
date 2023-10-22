import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    // the forced undefined here might be because of PartialMatchAsType accidentally borking functions? TODO check
    spec: ({number}) => number({value: {match: `custom`, value: (n: number | undefined) => (n!) > 10 && (n!) < 20}}),
  },
  operations => ({
    ar: [operations.postject(letters.plain.vowel.a, letters.plain.consonant.r)],
  }),
  {
    inConstruct: {
      spec: ({number}) => number(features => features.type.construct),
    },
  }
);
