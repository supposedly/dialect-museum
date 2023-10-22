import {fixRoot} from '../../ordinal/base';
import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {Merge} from '/lib/utils/typetools';

function emphatic<const Arg extends {features: object}>(arg: Arg): Merge<Arg, {features: {emphatic: true}}> {
  return {...arg, features: {...arg.features, emphatic: true}} as never;
}

export default ruleset(
  {
    spec: {features: {gender: `masculine`}},
    env: {},
  },
  operations => ({
    Waa7id: [
      operations.mock({
        type: `participle`,
        features: {
          shape: `faa3il`,
          root: fixRoot([
            emphatic(letters.plain.consonant.w),
            letters.plain.consonant.x,
            letters.plain.consonant.d,
          ]),
        },
      }),
    ],
    waa7id: [
      operations.mock({
        type: `participle`,
        features: {
          shape: `faa3il`,
          root: fixRoot([
            letters.plain.consonant.w,
            letters.plain.consonant.x,
            letters.plain.consonant.d,
          ]),
        },
      }),
    ],
    Waa7ad: [
      operations.mock({
        type: `verb`,
        features: {
          door: `faa3al`,
          root: fixRoot([
            emphatic(letters.plain.consonant.w),
            letters.plain.consonant.x,
            letters.plain.consonant.d,
          ]),
        },
      }),
    ],
    waa7ad: [
      operations.mock({
        type: `verb`,
        features: {
          door: `faa3al`,
          root: fixRoot([
            letters.plain.consonant.w,
            letters.plain.consonant.x,
            letters.plain.consonant.d,
          ]),
        },
      }),
    ],
  })
);
