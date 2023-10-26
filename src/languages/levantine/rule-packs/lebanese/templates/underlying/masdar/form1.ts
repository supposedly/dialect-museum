import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: ({masdar}) => masdar((features, traits) => traits.form1),
    env: {},
  },
  {
    // very good and normal hack
    default: ({features: {root: $, shape: [_, theme]}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel[theme as `a` | `i` | `u`],
      separateContext($[1], `affected`),
      separateContext($[2], `affected`),
    ],
  },
);
