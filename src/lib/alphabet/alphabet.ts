import {type Match, type MatchSchemaOf, type MatchSchema, type MatchAsType, type MatchInstance} from "../utils/match";
import {type ValuesOf} from "../utils/typetools";

export type AlphabetInput = {
  name: string
  context: Record<string, Match | ReadonlyArray<string>>
  types: Record<
    string,
    Record<
      string,
      (Match | ReadonlyArray<string>)
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
> = Path extends readonly [infer Head extends string, ...infer Tail extends ReadonlyArray<string>]
  ? {[K in Head]: ObjectFromPath<Tail, Leaf>}
  : Leaf;

export type QualifiedPathsOf<O, Path extends ReadonlyArray<string> = readonly []> = {
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
  [K in keyof O]: O[K] extends ReadonlyArray<MatchSchema>
    ? MatchInstance<`any`, O[K]>
    : O[K]
};

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
    NormalizeToMatch<ABC[`types`][T]> extends infer O extends MatchSchema
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

type Sources<
  T extends keyof ABC[`types`],
  ABC extends AlphabetInput,
  Traits extends Record<keyof ABC[`types`], MatchSchema>
> = {
  features: QualifiedPathsOf<ABC[`types`][T], [`features`]>,
  traits: QualifiedPathsOf<Traits[T], [`features`]>,
  context: QualifiedPathsOf<ABC[`context`], [`context`]>,
};

type TraitsOf<ABC extends AlphabetInput> = {
  [K in keyof ABC[`types`]]?: Record<string, ApplyMatchSchemaOf<ABC[`types`][K]>>
};

type ModifyFuncs<ABC extends AlphabetInput, Traits extends TraitsOf<ABC>> = {
  [T in keyof ABC[`types`]]: <
    const S extends Record<string, Record<string, Rule<T, ABC>>>,
  >(
    createRules: (sources: Sources<T, ABC, Traits>) => S,
  ) => S
};

type PromoteFuncs<ABC extends AlphabetInput, Traits extends TraitsOf<ABC>> = {
  [T in keyof ABC[`types`]]: <
    const NextABC extends AlphabetInput,
    const S extends Record<string, Record<string, Rule<T, ABC, NextABC>>>,
  >(
    nextAlphabet: NextABC,
    createRules: (sources: Sources<T, ABC, Traits>) => S,
  ) => S
};

function normalizeToMatch<const O extends Record<string, Match | ReadonlyArray<string>>>(
  o: O,
): NormalizeToMatch<O> {
  const ret = {} as Record<string, Match>;
  for (const key in o) {
    ret[key] = Array.isArray(o[key])
      ? {match: `any`, value: o[key] as string[]}
      : o[key] as Match;
  }
  return ret as NormalizeToMatch<O>;
}

function objectFromPath<
  const Path extends ReadonlyArray<string>,
  const Leaf,
>(path: Path, leaf: Leaf): ObjectFromPath<Path, Leaf> {
  const ret = {} as ObjectFromPath<Path, Leaf>;
  let current: unknown = ret;
  for (const key of path) {
    current = {[key]: leaf};
    current = (current as Record<typeof key, unknown>)[key];
  }
  return ret;
}

export function qualifiedPathsOf<
  const O extends Record<string, Match | ReadonlyArray<string> | Record<string, MatchSchema>>,
  const Path extends ReadonlyArray<string>,
>(
  o: O,
  path: Path
): QualifiedPathsOf<O, Path> {
  return Object.fromEntries(Object.entries(o).map(([k, v]) => {
    if (v === null || typeof v !== `object`) {
      return [k, objectFromPath(path, v)];
    }
    if (Array.isArray(v)) {
      return [k, qualifiedPathsOf(Object.fromEntries(v.map(k => [k, k])), [...path, k])];
    }
    if (`match` in v && v[`match`] === `any` && `value` in v && Array.isArray(v[`value`])) {
      return [k, qualifiedPathsOf(Object.fromEntries(v[`value`].map(k => [k, k])), [...path, k])];
    }
    if (`match` in v) {
      return [k, (m: unknown) => objectFromPath([...path, k], m)];
    }
    return [k, objectFromPath([...path, k], v)];
  }));
}

const test = qualifiedPathsOf({a: {b: 1}}, [`features`]);

export const alphabet = <
  const ABC extends AlphabetInput,
  const Traits extends TraitsOf<ABC>,
>(
    alphabet: ABC,
    traits: Traits,
  ): {
  name: ABC[`name`]
  types: {[K in keyof ABC[`types`]]: NormalizeToMatch<ABC[`types`][K]>}
  context: NormalizeToMatch<ABC[`context`]>
  traits: Traits
  modify: ModifyFuncs<ABC, Traits>
  promote: PromoteFuncs<ABC, Traits>
} => ({
    name: alphabet.name,
    context: normalizeToMatch(alphabet.context),
    types: Object.fromEntries(
      Object.entries(alphabet.types).map(([k, v]) => [k, normalizeToMatch(v)])
    ) as {[K in keyof ABC[`types`]]: NormalizeToMatch<ABC[`types`][K]>;},
    traits,
    modify: Object.fromEntries(
      Object.entries(alphabet.types).map(([k, v]) => [k, (
        createRules: (
          sources: Sources<string, AlphabetInput, Record<string, MatchSchema>>
        ) => Record<string, Record<string, {from: MatchSchema, into: Modify<string, AlphabetInput>}>>
      ) => createRules({
        features: qualifiedPathsOf(v, [`features`]),
        traits: qualifiedPathsOf(traits[k] ?? {}, [`features`]),
        context: qualifiedPathsOf(alphabet.context, [`context`]),
      })])
    ) as ModifyFuncs<ABC, Traits>,
    promote: Object.fromEntries(
      Object.entries(alphabet.types).map(([k, v]) => [k, (
        nextAlphabet: AlphabetInput,
        createRules: (
          sources: Sources<string, AlphabetInput, Record<string, MatchSchema>>
        ) => Record<string, Record<string, {from: MatchSchema, into: Promote<string, AlphabetInput, AlphabetInput>}>>
      ) => createRules({
        features: qualifiedPathsOf(v, [`features`]),
        traits: qualifiedPathsOf(traits[k] ?? {}, [`features`]),
        context: qualifiedPathsOf(alphabet.context, [`context`]),
      })])
    ) as PromoteFuncs<ABC, Traits>,
  });
