import {MatchAsType, MatchSchema, MatchSchemaOf, SafeMatchSchemaOf} from "./utils/match";
import {IsUnion, MergeUnion, ValuesOf} from "./utils/typetools";
import {Alphabet, MembersWithContext, QualifiedPathsOf} from "./alphabet";

export type NestedArray<T> = ReadonlyArray<T | NestedArray<T>>;
export type NestedArrayOr<T> = T | ReadonlyArray<NestedArrayOr<T>>;

type Spec<ABC extends Alphabet> = (
  | MembersWithContext<ABC> | keyof ABC[`types`]
  | ((types: TypesFuncs<ABC>) => MembersWithContext<ABC>)
);
type Env<ABC extends Alphabet> = (
  | {[Dir in `next` | `prev`]?: NestedArray<MembersWithContext<ABC>>}
  | EnvironmentFunc<ABC>
);

type _Specs<
  ABC extends Alphabet,
  ABCHistory extends ReadonlyArray<Alphabet> | undefined = undefined,
> = MergeUnion<
  | {
    spec?: Spec<ABC>
    env?: Env<ABC>
  }
  | (ABCHistory extends ReadonlyArray<infer U extends Alphabet> ?
    ABCHistory[`length`] extends 0 ? never : {
      was?: {
        [A in U as A[`name`]]: {
          spec: Spec<A>,
          env: Env<A>
        }
      }}
    : never
  )
>;

export type Specs<
  ABC extends Alphabet,
  ABCHistory extends ReadonlyArray<Alphabet> | undefined = []
> = MatchSchemaOf<_Specs<ABC, ABCHistory>>;

type _TypesFuncDefault<T, D extends MatchSchema> = MatchAsType<SafeMatchSchemaOf<D> extends T ? D : T>;
type _TypesFuncVF<in out Source extends Alphabet, in out T extends keyof Source[`types`]> = (
  (features: QualifiedPathsOf<Source[`types`][T]>) => SafeMatchSchemaOf<Source[`types`][T]>
);
type _TypesFuncContextF<in out Source extends Alphabet> = (
  ((context: QualifiedPathsOf<Source[`context`]>) => SafeMatchSchemaOf<Source[`context`]>)
);
export type TypesFunc<Source extends Alphabet, T extends keyof Source[`types`]> =
  <
    // typing V and Context as unions of (obj | func) was really hard on the compiler for some reason
    // it would sporadically decide that only the object half of that union was valid and reject
    // functions for not matching (maybe it had to do w/ the function's return type matching the expected
    // obj type = common bug heuristic for "did you mean to call this expression"? not sure)
    // anyway we can hijack inference to get around all that:
    const V extends (
      // if this type has only one feature (like how some alphabets only have {value: (some symbol)}) then
      // we can just allow that feature's value to be passed without the feature name as a key
      IsUnion<keyof Source[`types`][T]> extends true
        ? SafeMatchSchemaOf<Source[`types`][T]>
        : SafeMatchSchemaOf<ValuesOf<Source[`types`][T]>>
      ),
    const VF extends _TypesFuncVF<Source, T>,
    const Context extends SafeMatchSchemaOf<Source[`context`]>,
    const ContextF extends _TypesFuncContextF<Source>
  >(features?: V | VF, context?: Context | ContextF) => {
    type: T
    // now we have to check which of V/VF, Context/ContextF was actually passed in
    // since the funcs are invariant on Source and T it won't matter what order we
    // do the `extends` check in, but since this order is used for covariant types
    // we can stick with it here too
    features: _TypesFuncVF<Source, T> extends VF
      ? IsUnion<keyof Source[`types`][T]> extends true
        ? _TypesFuncDefault<V, Source[`types`][T]>
        : {[K in keyof Source[`types`][T]]: _TypesFuncDefault<V, Source[`types`][T]>}
      : MatchAsType<ReturnType<VF>>
    context: _TypesFuncContextF<Source> extends ContextF
      ? _TypesFuncDefault<Context, Source[`context`]>
      : MatchAsType<ReturnType<ContextF>>
  }
;

export type TypesFuncs<Source extends Alphabet> = {
  [T in keyof Source[`types`]]: TypesFunc<Source, T>
} & (
  <
    const Context extends SafeMatchSchemaOf<Source[`context`]>,
    const ContextF extends _TypesFuncContextF<Source>
  >(segment: Context | ContextF) => ({
    context: _TypesFuncContextF<Source> extends ContextF
    ? _TypesFuncDefault<Context, Source[`context`]>
    : MatchAsType<ReturnType<ContextF>>
  })
);

export type EnvironmentFunc<
  Source extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet> | undefined = undefined
> = (
  env: {
    before<
      const Arr extends ReadonlyArray<SafeMatchSchemaOf<NestedArrayOr<MembersWithContext<Source>>>>
    >(...arr: Arr): {env: {next: Arr}},
    after<
      const Arr extends ReadonlyArray<SafeMatchSchemaOf<NestedArrayOr<MembersWithContext<Source>>>>
    >(...arr: Arr): {env: {prev: Arr}},
  },
  types: TypesFuncs<Source>,
  context: QualifiedPathsOf<Source[`context`]>
  // if i change the def of MatchSchema's function variant to => MatchSchema instead of => unknown this errors lol
  // bc recursive reference that apparently isn't an issue with => unknown??
  ) => Specs<Source, Dependencies>;
