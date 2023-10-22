import ruleset, {fixRoot} from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 2}},
    env: {},
  },
  operations => ({
    default: [
      operations.mock({
        type: `participle`,
        features: {
          shape: `faa3il`,
          root: fixRoot([
            letters.plain.consonant.th,
            letters.plain.consonant.m,
            letters.plain.consonant.n,
          ]),
        },
      }),
    ],
  })
);
