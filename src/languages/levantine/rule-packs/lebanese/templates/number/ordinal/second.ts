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
          root: fixRoot(weak => [
            letters.plain.consonant.th,
            letters.plain.consonant.n,
            weak(letters.plain.consonant.y),
          ]),
        },
      }),
    ],
  })
);
