import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {Merge} from '/lib/utils/typetools';

function emphatic<const Arg extends {features: object}>(arg: Arg): Merge<Arg, {features: {emphatic: true}}> {
  return {...arg, features: {...arg.features, emphatic: true}} as never;
}

export default ruleset(
  {
    spec: {},
    env: {},
  },
  operations => ({
    default: [
      operations.postject(
        emphatic(letters.plain.consonant.t),
        letters.plain.vowel.a,
        letters.plain.consonant.c,
        letters.plain.consonant.sh,
      ),
    ],
  })
);
