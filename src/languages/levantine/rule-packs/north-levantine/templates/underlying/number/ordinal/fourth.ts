import ruleset, {fixRoot} from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

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
          root: fixRoot((weak, emphatic) => [
            emphatic(letters.plain.consonant.r),
            letters.plain.consonant.b,
            letters.plain.consonant.c,
          ]),
        },
      }),
    ],
  })
);
