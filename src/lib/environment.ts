import {MatchAsType, MatchSchema, MatchSchemaOf, SafeMatchSchemaOf} from "./utils/match";
import {IsUnion, MergeUnion, ValuesOf} from "./utils/typetools";
import {Alphabet, ApplyMatchAsType, MembersWithContext, QualifiedPathsOf} from "./alphabet";

export type NestedArray<T> = ReadonlyArray<T | NestedArray<T>>;
export type NestedArrayOr<T> = T | ReadonlyArray<NestedArrayOr<T>>;

export type Specs<
  ABC extends Alphabet,
  ABCHistory extends ReadonlyArray<Alphabet> | undefined = undefined,
  T extends keyof ABC[`types`] = string
> =
  | MatchSchemaOf<MergeUnion<
    | {
      spec:
        | (T extends keyof ABC[`types`]
            ? ApplyMatchAsType<ABC[`types`][T]>
            : MembersWithContext<ABC> | keyof ABC[`types`]
        )
        | ((types: TypesFuncs<ABC>) => MembersWithContext<ABC>)
      env:
        | {[Dir in `next` | `prev`]?: NestedArray<MembersWithContext<ABC>>} 
        | EnvironmentFunc<ABC>
    }
    | (ABCHistory extends ReadonlyArray<infer U extends Alphabet> ?
      {was: {[A in U as A[`name`]]: Specs<A>}}
      : never
    )
  >>
  // this is so broken
  // it only works because of the EXACT configuration of this union, the unions of
  // spec: and env: above with these function types, and the fact that
  // PartialMatchAsType doesn't special-case functions to not Partial<> them
  // changing any one of those facts makes generic params that extend Specs<...> not
  // recognize methods either with or without this union
  // meanwhile in the current state of things this union somehow allows you to mix and
  // match methods (ie spec func, env record or vice versa) and removing it allows you
  // to do neither
  | {
    spec?: ((types: TypesFuncs<ABC>) => MembersWithContext<ABC>)
    env?: EnvironmentFunc<ABC>
  };

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
    segment: _TypesFuncContextF<Source> extends ContextF
    ? _TypesFuncDefault<Context, Source[`context`]>
    : MatchAsType<ReturnType<ContextF>>
  })
);

export type EnvironmentFunc<Source extends Alphabet> = (
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
) => Specs<Source>;
