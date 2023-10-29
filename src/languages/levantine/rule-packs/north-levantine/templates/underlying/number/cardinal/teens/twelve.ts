import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {Merge} from '/lib/utils/typetools';

function emphatic<const Arg extends {features: object}>(arg: Arg): Merge<Arg, {features: {emphatic: true}}> {
  return {...arg, features: {...arg.features, emphatic: true}} as never;
}

export default ruleset(
  {
    spec: ({number}) => number({value: 12}),
    env: {},
  },
  {
    thna3sh: [
      letters.plain.consonant.th,
      letters.plain.consonant.n,
      letters.plain.vowel.a,
      letters.plain.consonant.sh,
    ],
    Tna3sh: [
      emphatic(letters.plain.consonant.t),
      letters.plain.consonant.n,
      letters.plain.vowel.a,
      letters.plain.consonant.sh,
    ],
    THna3sh: [  // exists??
      emphatic(letters.plain.consonant.th),
      letters.plain.consonant.n,
      letters.plain.vowel.a,
      letters.plain.consonant.sh,
    ],
  }
);
