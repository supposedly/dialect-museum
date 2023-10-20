import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({participle}) => participle((features, traits) => traits.maziidST),
  },
  operations => ({
    default: [operations.preject(letters.plain.consonant.s, letters.plain.consonant.t)],
  })
);
