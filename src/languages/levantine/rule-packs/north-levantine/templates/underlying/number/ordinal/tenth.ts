import ruleset, {fixRoot} from './ruleset';
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
            letters.plain.consonant.c,
            letters.plain.consonant.sh,
            letters.plain.consonant.r,
          ]),
        },
      }),
    ],
  })
);
