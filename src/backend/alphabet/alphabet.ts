import {type Match, type MatchSchemaOf, type MatchSchema, type MatchAsType, type MatchInstance} from "../utils/match";
import {type MergeUnion, type ValuesOf} from "../utils/typetools";

export type AlphabetInput = {
  name: string
  ctx: Record<string, Match>
  types: Record<
    string,
    Record<
      string,
      | ReadonlyArray<string>
      | Match
    >
  >
};
export type Alphabet = {
  name: string
  ctx: Record<string, Match>
  types: Record<string, Record<string, Match>>
  traits: Record<string, Record<string, MatchSchema>>
  transform: Record<string, Function>
  promote: Record<string, Function>
};

export type ObjectFromPath<Path extends ReadonlyArray<keyof any>, Leaf> = Path extends [infer Head extends keyof any, ...infer Tail extends Array<keyof any>]
  ? {[K in Head]: ObjectFromPath<Tail, Leaf>}
  : Leaf;

export type QualifiedPathsOf<O, Path extends Array<keyof any> = []> = {
  [K in keyof O]: O[K] extends MatchInstance<`any`, ReadonlyArray<infer U extends string>> | ReadonlyArray<infer U extends string> ?
    QualifiedPathsOf<{[J in U]: J}, [...Path, K]>
    : O[K] extends Match ? ObjectFromPath<
        Path,
        <const M extends Partial<MatchAsType<O[K]>> extends infer Deferred ? Deferred : never>(m: M) => ObjectFromPath<[...Path, K], M>
      >
    : ObjectFromPath<Path, O[K]>
};

export type ApplyMatchSchemaOf<O> = {
  [K in keyof O]?: O[K] extends infer Deferred ?
    Deferred extends Match ? MatchSchemaOf<Deferred>
    : Deferred extends ReadonlyArray<infer U extends MatchSchema> ? MatchSchemaOf<U>
    : never : never
};
export type ApplyMatchAsType<O> = {
  [K in keyof O]: O[K] extends infer Deferred
    ? Deferred extends Match ? MatchAsType<Deferred>
    : Deferred extends ReadonlyArray<infer U extends MatchSchema> ? MatchAsType<U>
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
transform: {
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
  ((input: ApplyMatchAsType<ABC[`types`][T]>) => ReadonlyArray<Partial<ApplyMatchAsType<ABC[`types`][T]>>>);

type Replacement<T extends keyof CurrentABC[`types`], CurrentABC extends AlphabetInput, NextABC extends AlphabetInput> =
  ((input: ApplyMatchAsType<CurrentABC[`types`][T]>) => ReadonlyArray<ValuesOf<{
    [K in keyof NextABC[`types`]]: MergeUnion<{context?: ApplyMatchAsType<CurrentABC[`ctx`]>} | {[k in K]: ApplyMatchAsType<NextABC[`types`][K]>}>
  }>>);

type Transform<
  T extends keyof CurrentABC[`types`],
  CurrentABC extends AlphabetInput
> = InPlaceOrEject<Modification<T, CurrentABC>, Replacement<T, CurrentABC, CurrentABC>>;

type Promote<
  T extends keyof CurrentABC[`types`],
  CurrentABC extends AlphabetInput,
  NextABC extends AlphabetInput
> = InPlaceOrEject<Replacement<T, CurrentABC, NextABC>>;

type OptionalParams<T> = T | {feed: (...args: never[]) => T}

export const alphabet = <
  const O extends AlphabetInput,
  const Traits extends {[K in keyof O[`types`]]?: Record<string, ApplyMatchSchemaOf<O[`types`][K]>>}
>(
  alphabet: O,
  traits: Traits
): {
  name: O[`name`]
  types: NormalizeToMatch<O[`types`]>
  ctx: NormalizeToMatch<O[`ctx`]>
  traits: Traits
  transform: {
    [T in keyof O[`types`]]: <
      const R extends Record<string, OptionalParams<Transform<T, O>>>
    >(
      createLibrary: (features: QualifiedPathsOf<O[`types`][T]>) => R,
      rules: (library: R) => R,
    ) => R
  }
  promote: {
    [T in keyof O[`types`]]: <
      const ABC extends Alphabet,
      const R extends Record<string, OptionalParams<Promote<T, O, ABC>>>
    >(
      alphabet: ABC,
      library: R,
      rules: Record<string, unknown>
    ) => R
  }
} => ({
  name: alphabet.name,
  ctx: alphabet.ctx as any,
  types: alphabet.types as any,
  traits,
  transform: {} as any,
  promote: {} as any,
});
