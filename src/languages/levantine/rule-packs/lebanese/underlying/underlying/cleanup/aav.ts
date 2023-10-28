import ruleset from '../ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: letters.plain.vowel.aa,
    env: ({after}, {vowel}) => after(vowel({long: false})),
  },
  {
    default: [],
  },
);
