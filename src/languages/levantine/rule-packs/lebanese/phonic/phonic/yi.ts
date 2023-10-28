import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.vowel.i,
    env: ({after, before}, {boundary}) => ({
      ...after(letters.plain.consonant.y),
      ...before(boundary((features, traits) => traits.suprasyllabic)),
    }),
  },
  {
    delete: [],
    retain: [letters.plain.vowel.i],
  }
);
