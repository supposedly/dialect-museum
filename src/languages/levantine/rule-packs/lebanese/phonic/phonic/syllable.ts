import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: null,
    env: ({before, after}, {consonant, vowel, boundary}) => ({
      match: `all`,
      value: [
        after(vowel.seek({}, {}, consonant())),
        before(
          consonant.seek({}, {}, boundary(`morpheme`)),
          vowel()
        ),
      ],
    }),
  },
  {
    default: [letters.plain.boundary.syllable],
  }
);
