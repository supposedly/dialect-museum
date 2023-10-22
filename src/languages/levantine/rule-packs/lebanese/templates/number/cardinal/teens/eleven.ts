import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({number}) => number({value: 11}),
    env: {},
  },
  {
    xda3sh: [
      letters.plain.consonant.x,
      letters.plain.consonant.d,
      letters.plain.vowel.a,
      letters.plain.consonant.sh,
    ],
    iida3sh: [
      letters.plain.consonant.$,
      letters.plain.vowel.ii,
      letters.plain.consonant.d,
      letters.plain.vowel.a,
      letters.plain.consonant.sh,
    ],
  }
);
