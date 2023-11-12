import {MatchInstance, MatchSchema, MatchAsType, MatchSchemaOf, SafeMatchSchemaOf} from 'src/lib/utils/match';
import {IsUnion, NestedArray, NestedArrayOr, NeverSayNever, ValuesOf} from 'src/lib/utils/typetools';
import {Alphabet, PartialMembersWithContext, QualifiedPathsOf} from 'src/lib/alphabet';

export type Spec<ABC extends Alphabet> = (
  | PartialMembersWithContext<ABC>// | (keyof ABC[`types`] & string)
  | ((types: TypesFuncs<ABC>) => SafeMatchSchemaOf<PartialMembersWithContext<ABC>>)
);
export type Env<Source extends Alphabet, Target extends Alphabet, Dependencies extends ReadonlyArray<Alphabet>> = (
  | {[Dir in `next` | `prev`]?: NestedArray<{
      spec?: Exclude<Spec<Source>, (...args: never) => unknown>,
      was?: {
        [A in Dependencies[number] | Source as A[`name`]]: {
          spec?: Spec<A>,
          env?: Env<A, Target, Dependencies>
        }
      }
    }>
  }
  | EnvironmentFunc<Source, Target, Dependencies>
);
export type EnvironmentFunc<
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet> = readonly []
> = (
  env: EnvironmentHelpers<Source, Target, Dependencies>,
  types: TypesFuncs<Source>,
// if i change the def of MatchSchema's function variant to => MatchSchema instead of => unknown this errors lol
// bc recursive reference that apparently isn't an issue with => unknown??
) => SafeMatchSchemaOf<Exclude<Env<Source, Target, Dependencies>, (...args: never) => unknown>>;

export type SpecsNoMatch<
  in out Source extends Alphabet,
  in out Target extends Alphabet,
  in out Dependencies extends ReadonlyArray<Alphabet> = readonly [],
  in out OmitKeys extends `spec` | `env` | `was` | `target` = never,
> = Omit<{
  spec: `spec` extends OmitKeys ? never : Spec<Source>
  env: `env` extends OmitKeys ? never : Env<Source, Target, Dependencies>
  was: `was` extends OmitKeys ? never : {
    [A in Dependencies[number] | Source as A[`name`]]: {
      spec?: Spec<A>
      env?: Env<A, never, Dependencies>
    }
  }
  target: `target` extends OmitKeys ? never : {
    spec?: Spec<Target>
    env?: Env<Target, never, Dependencies>
  }
}, OmitKeys>;

export type Specs<
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet> = readonly [],
  OmitKeys extends `spec` | `env` | `was` = never,
> = MatchSchemaOf<SpecsNoMatch<Source, Target, Dependencies, OmitKeys>>;

type _TypesFuncDefault<T, D extends MatchSchema> = SafeMatchSchemaOf<D> extends T ? never : T;
type _TypesFuncVF<in out Source extends Alphabet, in out T extends keyof Source[`types`]> = (
  (
    features: QualifiedPathsOf<Source[`types`][T]>,
    traits: T extends keyof Source[`traits`] ? Source[`traits`][T] : undefined
  ) => SafeMatchSchemaOf<Source[`types`][T]>
);
type _TypesFuncContextF<in out Source extends Alphabet> = (
  ((context: QualifiedPathsOf<Source[`context`]>) => SafeMatchSchemaOf<Source[`context`]>)
);
type _VCond<Source extends Alphabet, T extends keyof Source[`types`]> = (
  IsUnion<keyof Source[`types`][T]> extends true
    ? SafeMatchSchemaOf<Source[`types`][T]>
    : SafeMatchSchemaOf<ValuesOf<Source[`types`][T]>>
);

type _FeaturesCond<Source extends Alphabet, T extends keyof Source[`types`], V, VF extends (...args: never) => unknown> = _TypesFuncVF<Source, T> extends VF
  ? IsUnion<keyof Source[`types`][T]> extends true
    ? _TypesFuncDefault<V, Source[`types`][T]>
    : {[K in keyof Source[`types`][T]]: _TypesFuncDefault<V, ValuesOf<Source[`types`][T]>>}
  : ReturnType<VF>;
type _ContextCond<Source extends Alphabet, Context, ContextF extends (...args: never) => unknown> = _TypesFuncContextF<Source> extends ContextF
  ? _TypesFuncDefault<Context, Source[`context`]>
  : ReturnType<ContextF>;
// these two `in out` annotations are the O-rings that would've saved the challenger
// literally went from almost 13k lines of analyze-trace output to nil
export type TypesFuncWithoutSeek<in out Source extends Alphabet, in out T extends keyof Source[`types`]> =(
  <
    // typing V and Context as unions of (obj | func) was really hard on the compiler for some reason
    // it would sporadically decide that only the object half of that union was valid and reject
    // functions for not matching (maybe it had to do w/ the function's return type matching the expected
    // obj type = common bug heuristic for "did you mean to call this expression"? not sure)
    // anyway we can hijack inference to get around all that:
    // (update after 1 profiling session: predictably this is slow as shit LOL)
    const V extends (
      // if this type has only one feature (like how some alphabets only have {value: (some symbol)}) then
      // we can just allow that feature's value to be passed without the feature name as a key
      _VCond<Source, T>
      ),
    const VF extends _TypesFuncVF<Source, T>,
    const Context extends SafeMatchSchemaOf<Source[`context`]>,
    const ContextF extends _TypesFuncContextF<Source>
  >(features?: V | VF, context?: Context | ContextF) => NeverSayNever<{
    type: T
    // now we have to check which of V/VF, Context/ContextF was actually passed in
    // since the funcs are invariant on Source and T it won't matter what order we
    // do the `extends` check in, but since this order is used for covariant types
    // we can stick with it here too
    features: _FeaturesCond<Source, T, V, VF>
    context: _ContextCond<Source, Context, ContextF>
  }>
);

export type TypesFuncSeek<in out Source extends Alphabet, in out T extends keyof Source[`types`]> = {
  seek: <
    const V extends _VCond<Source, T>,
    const VF extends _TypesFuncVF<Source, T>,
    const Context extends SafeMatchSchemaOf<Source[`context`]>,
    const ContextF extends _TypesFuncContextF<Source>,
    const Filter extends SafeMatchSchemaOf<Spec<Source>> | ReadonlyArray<unknown> = never,
    const FilterLength extends ReadonlyArray<number> = never,
  >(features?: V | VF, context?: Context | ContextF, filter?: Filter, filterLength?: FilterLength) => [
    ...(Filter extends ReadonlyArray<unknown> ? Filter : [MatchInstance<
      `array`,
      {
        fill: [Filter] extends [never] ? Record<string, never> : Filter,
        length: [FilterLength] extends [never] ? MatchInstance<`type`, `number`> : MatchInstance<`any`, FilterLength>
      }
    >]),
    NeverSayNever<{
      type: T
      features: _FeaturesCond<Source, T, V, VF>
      context: _ContextCond<Source, Context, ContextF>
    }>
  ],
};

export type TypesFunc<Source extends Alphabet, T extends keyof Source[`types`]> = (
  & TypesFuncWithoutSeek<Source, T>
  & TypesFuncSeek<Source, T>
);

export type ContextFuncWithoutSeek<Source extends Alphabet> = (
  <
    const Context extends SafeMatchSchemaOf<Source[`context`]>,
    const ContextF extends _TypesFuncContextF<Source>
  >(segment: Context | ContextF) => ({
    context: _ContextCond<Source, Context, ContextF>
  })
);

export type ContextFuncSeek<Source extends Alphabet> = {
  seek: <
    const Context extends SafeMatchSchemaOf<Source[`context`]>,
    const ContextF extends _TypesFuncContextF<Source>,
    const Filter extends SafeMatchSchemaOf<Spec<Source>> | ReadonlyArray<unknown> = never,
    const FilterLength extends ReadonlyArray<number> = never,
  >(segment: Context | ContextF, filter?: Filter, filterLength?: FilterLength) => [
    ...(Filter extends ReadonlyArray<unknown> ? Filter : [MatchInstance<
      `array`,
      {
        fill: [Filter] extends [never] ? Record<string, never> : Filter,
        length: [FilterLength] extends [never] ? MatchInstance<`type`, `number`> : MatchInstance<`any`, FilterLength>
      }
    >]),
    {context: _ContextCond<Source, Context, ContextF>},
  ]
};

export type ContextFunc<Source extends Alphabet> = (
  & ContextFuncWithoutSeek<Source>
  & ContextFuncSeek<Source>
);

export type TypesFuncs<Source extends Alphabet> = {
  [T in keyof Source[`types`] & string]: TypesFunc<Source, T>
} & ContextFunc<Source>;

export type AddSpec<Arr extends ReadonlyArray<unknown>> = {
  [Index in keyof Arr]: Arr[Index] extends ReadonlyArray<unknown>
    ? AddSpec<Arr[Index]>
    : Arr[Index] extends {spec: unknown}
    ? Arr[Index]
    : Arr[Index] extends {match: `array`, value: {fill: infer Fill, length: infer Length}}
    ? {match: `array`, value: {fill: AddSpec<[Fill]>[number], length: Length}}
    : Arr[Index] extends {match: infer M extends `any` | `all`, value: infer Value extends ReadonlyArray<unknown>}
    ? {match: M, value: AddSpec<Value>}
    : {spec: Arr[Index]}
}

type CustomArgType<
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet>
> = Pick<
  Exclude<Env<Source, Target, Dependencies>, (...args: never) => unknown>,
  `next` | `prev`
>;

type _ArrType<Source extends Alphabet> = ReadonlyArray<SafeMatchSchemaOf<NestedArrayOr<PartialMembersWithContext<Source>>>>;
export type EnvironmentHelpers<Source extends Alphabet, Target extends Alphabet, Dependencies extends ReadonlyArray<Alphabet>> = {
  before: {
    <const Arr extends ReadonlyArray<unknown>>(...arr: Arr): {
      next: AddSpec<Arr>
    }
    // slow<const Arr extends _ArrType<ABC>>(...arr: Arr): {next: Arr}
  }
  after: {
    <const Arr extends ReadonlyArray<unknown>>(...arr: Arr): {
      prev: AddSpec<Arr>
    }
    // slow<const Arr extends _ArrType<ABC>>(...arr: Arr): {prev: Arr}
  }
  custom<
    const M extends SafeMatchSchemaOf<CustomArgType<Source, Target, Dependencies>>,
    const C extends (arg: MatchAsType<M>) => boolean,
  >(match: M, func: C): MatchInstance<
    `all`,
    [
      M,
      // can't just use MatchInstance<`custom`, C> bc contravariance
      MatchInstance<`custom`, (arg: CustomArgType<Source, Target, Dependencies>) => boolean>
    ]
  >
};

export type SpecsFuncs<Source extends Alphabet, Target extends Alphabet, Dependencies extends ReadonlyArray<Alphabet>> = {
  env: EnvironmentHelpers<Source, Target, Dependencies>,
  types: TypesFuncs<Source>,
};


// !!! here lurketh something sinister !!!
// i think my entire type system is glued together by lies
// try it yourself: type Foo<T extends TypesFuncs<Alphabet>> = T; type Bar<T extends Alphabet> = Foo<TypesFuncs<T>>;
// opened the gates of hell chasing these errors down and got absolutely nowhere so i decided to just ignore the lie
// and find another way to do the thing i was trying to do :---) (i think this came up while trying to implement
// operations for the first time, see corroborating comment in func.ts)
