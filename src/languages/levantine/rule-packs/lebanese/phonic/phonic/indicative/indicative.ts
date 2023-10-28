import ruleset from '../ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: ({consonant}) => consonant(),
    env: ({after, before}, {consonant, boundary}) => ({
      ...after(consonant.seek({}, {}, boundary(`morpheme`))),
      ...before(consonant()),
    }),
  },
  operations => ({
    // this must be before e -> schwa happens
    // really the correct way to do this would be to preject(mock.was.underlying(i)) but... mock.was is bad
    default: [operations.preject(letters.plain.vowel.e)],
  })
);
