import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  operations => ({
    default: ({features: {tam}}) => [
      operations.preject(
        letters.plain.consonant.s,
        letters.plain.consonant.t,
        letters.plain.vowel.a,
      ),
      operations.mock({
        features: {
          door: `f3vl`,
          // this is ofc hacky and would more-idiomatically be handled w diff rulesets + diff specs
          theme: tam === `past` ? `a` : `i`,
        },
      }),
    ],
  }),
);
