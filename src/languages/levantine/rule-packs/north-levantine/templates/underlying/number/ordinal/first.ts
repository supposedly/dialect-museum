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
        type: `special`,
        features: {
          shape: `af3al`,
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
