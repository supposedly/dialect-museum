import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({participle}) => participle((features, traits) => traits.maziidT),
  },
  operations => ({
    default: [operations.preject(letters.plain.consonant.t)],
  })
);
