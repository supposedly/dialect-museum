import {templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';
import {letters} from '/languages/levantine/alphabets/underlying';
import {Merge, ValuesOf} from '/lib/utils/typetools';
import {ApplyMatchAsType} from '/lib/alphabet';

type Argument = {
  type: `consonant`,
  features: ApplyMatchAsType<typeof underlying[`types`][`consonant`]>,
  context: ApplyMatchAsType<typeof underlying[`context`]>,
}

export function fixRoot<
  const Arr extends ReadonlyArray<Argument & {features: {weak?: boolean, affected?: boolean}}>
>(
  args: Arr | ((
    weak: <const Arg extends {features: object}>(arg: Arg) => Arg & {features: {weak: true}},
    emphatic: <const Arg extends {features: object}>(arg: Arg) => Merge<Arg, {features: {emphatic: true}}>,
    affected: <const Arg extends {features: object}>(arg: Arg) => Arg & {features: {affected: true}},
  ) => Arr)
): Arr extends ReadonlyArray<Argument>
  ? {
    [Index in keyof Arr]:
      `features` extends keyof Arr[Index]
        ? Merge<{readonly weak: false, readonly affected: false}, Arr[Index][`features`]>
        : never
  }
  : Arr extends (...args: never) => ReadonlyArray<Argument>
  ? {
    [Index in keyof ReturnType<Arr>]: ReturnType<Arr>[Index][`features`]
  }
  : never
{
  if (args instanceof Function) {
    return args(
      arg => ({...arg, features: {...arg.features, weak: true}}),
      arg => ({...arg, features: {...arg.features, emphatic: true}} as never),
      arg => ({...arg, features: {...arg.features, affected: true}})
    ).map(letter => letter.features) as never;
  }
  return args.map(
    letter => ({...letter.features, weak: false, affected: false})
  ) as never;
}

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({number}) => number({type: `ordinal`}),
    env: {},
  }
);
