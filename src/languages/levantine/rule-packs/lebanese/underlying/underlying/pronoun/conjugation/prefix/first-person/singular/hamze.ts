// no hamze if after indicative prefix
// maybe this should be after({target: {spec: {type: `consonant`}}}) tbh but idk
import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: ({after}, {boundary}) => after(boundary((features, traits) => traits.suprasyllabic)),
  },
  operations => ({
    default: [
      operations.preject(letters.plain.consonant.$),
    ],
  })
);
