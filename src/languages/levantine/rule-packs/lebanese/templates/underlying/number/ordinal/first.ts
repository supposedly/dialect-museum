import ruleset, {fixRoot} from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {features: {value: 1}},
    env: {},
  },
  operations => ({
    default: [
      operations.mock({
        type: `af3al`,
        features: {
          root: fixRoot([
            letters.plain.consonant.w,
            letters.plain.consonant.w,
            letters.plain.consonant.l,
          ]),
        },
      }),
    ],
  })
);
