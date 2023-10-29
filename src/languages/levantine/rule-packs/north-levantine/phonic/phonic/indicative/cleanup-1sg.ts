import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: letters.plain.consonant.$,
    env: ({before}, {consonant}) => before(consonant()),
    was: {
      underlying: {
        spec: {type: `pronoun`},
      },
    },
  },
  {
    // delete
    default: [],
  }
);
