import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

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
