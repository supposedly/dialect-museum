import {type Match, type MatchSchemaOf, type MatchSchema, type MatchAsType, type MatchInstance} from "../utils/match";
import {type MergeUnion, type ValuesOf} from "../utils/typetools";

export type AlphabetInput = {
  name: string
  context: Record<string, Match>
  types: Record<
    string,
    Record<
      string,
      (ReadonlyArray<string> | Match)
    >
  >
};
export type Alphabet = {
  name: string
  context: Record<string, Match>
  types: Record<string, Record<string, Match>>
  traits: Record<string, Record<string, MatchSchema>>
  modify: Record<string, (...args: never[]) => unknown>
  promote: Record<string, (...args: never[]) => unknown>
};

export type ObjectFromPath<
  Path extends ReadonlyArray<string>,
  Leaf
> = Path extends [infer Head extends string, ...infer Tail extends Array<string>]
  ? {[K in Head]: ObjectFromPath<Tail, Leaf>}
  : Leaf;

export type QualifiedPathsOf<O, Path extends Array<string> = []> = {
  [K in keyof O & string]: O[K] extends (
    | MatchInstance<`any`, ReadonlyArray<infer U extends string>>
    | ReadonlyArray<infer U extends string>
   )
    ? QualifiedPathsOf<{[J in U]: J}, [...Path, K]>
    : O[K] extends Match
      ? <const M extends Partial<MatchAsType<O[K]>> extends infer Deferred ? Deferred : never>(
        m: M
      ) => ObjectFromPath<[...Path, K], M>
      : ObjectFromPath<Path, O[K]>
};

export type ApplyMatchSchemaOf<O> = {
  [K in keyof O]?: O[K] extends infer Deferred
    ? Deferred extends Match ? MatchSchemaOf<Deferred>
    : Deferred extends ReadonlyArray<infer U extends MatchSchema> ? MatchSchemaOf<U>
    : never : never
};
export type ApplyMatchAsType<O> = {
  [K in keyof O]: O[K] extends infer Deferred
    ? Deferred extends Match ? MatchAsType<Deferred>
    : Deferred extends ReadonlyArray<infer U extends string> ? U
    : never : never
};
export type NormalizeToMatch<O> = {
  [K in keyof O]: {
    [J in keyof O[K]]: O[K][J] extends ReadonlyArray<MatchSchema>
      ? MatchInstance<`any`, O[K][J]>
      : O[K][J]
  }
};

/* 
modify: {
  [T in keyof O[`types`]: <const R extends Record<string, unknown>>(
    createRules: (
      capture: <const C extends MatchSchemaOf<ProcessType<O[`types`][T]>> extends infer Deferred ? Deferred : never>(schema: C) => {
        apply: <
          const P extends ArrayOr<
            | ProcessType<O[`types`][T]>
            | ((
              captured: ProcessTypeNoPartial<O[`types`][T]>
            ) => ArrayOr<ValuesOf<{[K in keyof O[`types`]]: {[k in K]: ProcessTypeNoPartial<O[`types`][K]>}}>>)
        >>(target: P) => P,
        expand: <const P extends {
            [Dir in `left` | `right`]: ArrayOr<
              | ProcessType<O[`types`][T]>
              | ((
                captured: ProcessTypeNoPartial<O[`types`][T]>
              ) => ArrayOr<ValuesOf<{[K in keyof O[`types`]]: {[k in K]: ProcessTypeNoPartial<O[`types`][K]>}}>>)
            >
          }>(target: P) => P
      },
      abc: {
        features: QualifiedPathsOf<O[`types`][T], []>,
        traits: Traits[T]
      }
    ) => R
  ) => R
},
promote: {
  [T in keyof O[`types`]]:
      <const R extends Record<string, unknown>, const ABC extends Alphabet>(
        alphabet: ABC,
        createRules: (
          capture: <const S extends MatchSchemaOf<ProcessType<O[`types`][T]>> extends infer Deferred ? Deferred : never>(schema: S) => {
            apply: <
              const P extends ArrayOr<
                | ProcessType<O[`types`][T]>
                | ((
                  captured: ProcessTypeNoPartial<O[`types`][T]>
                ) => ArrayOr<ValuesOf<{[K in keyof ABC[`types`]]: {[k in K]: ProcessTypeNoPartial<ABC[`types`][K]>}}>>)
            >>(target: P) => P,
            expand: <const P extends {
                [Dir in `left` | `right`]: ArrayOr<
                  | ProcessType<O[`types`][T]>
                  | ((
                    captured: ProcessTypeNoPartial<O[`types`][T]>
                  ) => ArrayOr<ValuesOf<{[K in keyof ABC[`types`]]: {[k in K]: ProcessTypeNoPartial<ABC[`types`][K]>}}>>)
                >
              }>(target: P) => P
          },
          abc: {
            features: QualifiedPathsOf<O[`types`][T], []>,
            traits: Traits[T]
          }
        ) => R
      ) => R
}
*/

type InPlaceOrEject<A, B = A> = A | {[Dir in `left` | `right` | `replace`]?: B};

type Modification<T extends keyof ABC[`types`], ABC extends AlphabetInput> =
  (input: ApplyMatchAsType<ABC[`types`][T]>) => ReadonlyArray<
    Partial<ApplyMatchAsType<ABC[`types`][T]>> extends infer O
      ? {features?: O, context?: ApplyMatchAsType<ABC[`context`]>}
      : never
  >;

export type MembersWithContext<ABC extends AlphabetInput> = ValuesOf<{
  [K in keyof ABC[`types`]]: {
    type: K,
    features: ApplyMatchAsType<ABC[`types`][K]>,
    context?: ApplyMatchAsType<ABC[`context`]>
  }
}>;

type Replacement<T extends keyof CurrentABC[`types`], CurrentABC extends AlphabetInput, NextABC extends AlphabetInput> =
  ((input: ApplyMatchAsType<CurrentABC[`types`][T]>) => ReadonlyArray<MembersWithContext<NextABC>>);

export type Modify<
  T extends keyof CurrentABC[`types`],
  CurrentABC extends AlphabetInput
> = InPlaceOrEject<Modification<T, CurrentABC>, Replacement<T, CurrentABC, CurrentABC>>;

export type Promote<
  T extends keyof CurrentABC[`types`],
  CurrentABC extends AlphabetInput,
  NextABC extends AlphabetInput
> = InPlaceOrEject<Replacement<T, CurrentABC, NextABC>>;

type Rule<
  T extends keyof ABC[`types`],
  ABC extends AlphabetInput,
  NextABC extends AlphabetInput | undefined = undefined,
> = {
  from: MatchSchemaOf<
    NormalizeToMatch<ABC[`types`]>[T] extends infer O extends MatchSchema
      ? {features: O, context: ApplyMatchAsType<ABC[`context`]>}
      : never
  >
  into: ReadonlyArray<
    NextABC extends undefined
      ? Modify<T, ABC>
      // wow if you phrase the below as `NextABC & AlphabetInput` it hits you with
      // a "Type instantiation is excessively deep and possibly infinite" that's
      // not easy to diagnose
      : Promote<T, ABC, NextABC extends AlphabetInput ? NextABC : never>
  >
};

export const alphabet = <
  const ABC extends AlphabetInput,
  const Traits extends {[K in keyof ABC[`types`]]?: Record<string, ApplyMatchSchemaOf<ABC[`types`][K]>>},
>(
    alphabet: ABC,
    traits: Traits,
  ): {
  name: ABC[`name`]
  types: NormalizeToMatch<ABC[`types`]>
  context: NormalizeToMatch<ABC[`context`]>
  traits: Traits
  modify: {
    [T in keyof ABC[`types`]]: <
      const S extends Record<string, Record<string, Rule<T, ABC>>>,
    >(
      createRules: (
        sources: {
          features: QualifiedPathsOf<ABC[`types`][T], [`features`]>,
          traits: QualifiedPathsOf<Traits[T], [`features`]>,
          context: QualifiedPathsOf<ABC[`context`], [`context`]>,
        },
      ) => S,
    ) => S
  }
  promote: {
    [T in keyof ABC[`types`]]: <
      const NextABC extends AlphabetInput,
      const S extends Record<string, Record<string, Rule<T, ABC, NextABC>>>,
    >(
      nextAlphabet: NextABC,
      createRules: (
        sources: {
          features: QualifiedPathsOf<ABC[`types`][T], [`features`]>,
          traits: QualifiedPathsOf<Traits[T], [`features`]>,
          context: QualifiedPathsOf<ABC[`context`], [`context`]>,
        },
      ) => S,
    ) => S
  }
} => ({
    name: alphabet.name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: alphabet.context as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    types: alphabet.types as any,
    traits,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modify: {} as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promote: {} as any,
  });
