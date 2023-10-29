import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({number}) => number({
      match: `any`,
      value: [
        {type: `cardinal`, gender: `feminine`, value: {match: `custom`, value: (n: number | undefined) => (n!) !== 2}},
        {type: `cardinal`, value: {match: `custom`, value: (n: number | undefined) => (n!) <= 10 && (n!) > 2}},
      ],
    }),
  },
  operations => ({
    default: [operations.postject(letters.plain.affix.f)],
  })
);
