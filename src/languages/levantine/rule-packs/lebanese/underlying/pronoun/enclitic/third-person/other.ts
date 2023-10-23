import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({
      match: `any`,
      value: [
        {number: `singular`, gender: `feminine`},
        {number: `plural`},
      ]}
    ),
    env: {},
  },
  {
    default: [letters.plain.consonant.h],
  }
);
