import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

import {fixRoot} from './ordinal/base';

export default ruleset(
  {
    spec: {
      type: `number`,
      features: {
        type: `linking`,
        value: {match: `custom`, value: (n: number | undefined) => (n!) > 0 && (n!) < 10},
      },
    },
  },
  operations => ({
    default: [
      operations.mock(({number}) => number({type: `cardinal`, gender: `feminine`})),
      operations.postject(operations.mock({type: `word`, features: {value: fixRoot([letters.plain.consonant.w])}})),
    ],
  })
);
