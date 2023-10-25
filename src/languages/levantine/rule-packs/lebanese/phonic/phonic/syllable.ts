import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: null,
    env: ({before, after}, {consonant, vowel}) => ({
      match: `all`,
      value: [
        before(consonant(), vowel()),
        after(vowel.seek({}, {}, {type: `consonant`})),
      ],
    }),
  },
  {
    default: [letters.plain.boundary.syllable],
  }
);
