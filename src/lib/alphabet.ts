import {Any} from 'ts-toolbelt';
import {type Match, type MatchSchemaOf, type MatchSchema, type MatchAsType, type MatchInstance} from './utils/match';
import {KeysMatching, Merge, MergeUnion, UnionToIntersection, type ValuesOf} from './utils/typetools';

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
    ? MatchAsType<O[K]> extends boolean
      ? <const M extends boolean>(value?: M) => ObjectFromPath<[...Path, K], boolean extends M ? true : M>
      : <const M extends Partial<MatchAsType<O[K]>>>(
        value: M
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

export type PartialMembersWithContext<ABC extends AlphabetInput> = ValuesOf<{
  [T in keyof ABC[`types`] & string]: {
    type?: T,
    features?: Partial<ApplyMatchAsType<ABC[`types`][T]>>,
    context?: Partial<ApplyMatchAsType<ABC[`context`]>>
  }
}>;

export type MembersWithContext<ABC extends AlphabetInput> = ValuesOf<{
  // without this `& string` the following fails:
  //   type Foo<T extends MembersWithContext<Alphabet>> = ...;
  //   type Bar<T extends Alphabet> = Foo<MembersWithContext<T>>;
  // with a message indicating that the values of `type:` are incompatible
  // this ends up being v annoying to trace if the error is hidden within
  // more than one layer of parameterized types!
  [T in keyof ABC[`types`] & string]: {
    type: T,
    features: ApplyMatchAsType<ABC[`types`][T]>,
    context: ApplyMatchAsType<ABC[`context`]>
  }
}>;

type TraitsOf<ABC extends AlphabetInput> = {
  [K in keyof ABC[`types`]]?: Record<string, ApplyMatchSchemaOf<ABC[`types`][K]>>
};

type NormalizeTypes<Types extends AlphabetInput[`types`]> = {[K in keyof Types]: NormalizeToMatch<Types[K]>};

type MergedTraits<
  ABC extends AlphabetInput,
  TypeTraits extends TraitsOf<ABC>,
  FeatureTraits extends ReadonlyArray<{has: Record<string, MatchSchema>, traits: Record<string, MatchSchema>}>
> = Merge<TypeTraits, MergeUnion<ValuesOf<{
  // start by visiting each feature trait defined in this array
  [Idx in keyof FeatureTraits]: MergeUnion<ValuesOf<{
    // then look at the features specified in each one of those traits
    [K in keyof FeatureTraits[Idx][`has`]]: {
      // grab the names of the types of ABC that have those same features defined
      // (note: in runtime code i'm planning to use reference semantics for this instead of
      // equality-checking, compile-time code can ofc only do equality-checking, oh well)
      [T in KeysMatching<NormalizeTypes<ABC[`types`]>, FeatureTraits[Idx][`has`]>]:
        // finally associate each one of those type names with the traits defined for said features
        // the MergeUnion<>s will take care of slapping this together with the previously defined type-based traits
        FeatureTraits[Idx][`traits`]
    }
  }>>
}>>>;

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
  path?: Path
): QualifiedPathsOf<O, Path> {
  const defaultPath = path ?? [];
  return Object.fromEntries(Object.entries(o).map(([k, v]) => {
    if (v === null || typeof v !== `object`) {
      return [k, objectFromPath(defaultPath, v)];
    }
    if (Array.isArray(v)) {
      return [k, qualifiedPathsOf(Object.fromEntries(v.map(k => [k, k])), [...defaultPath, k])];
    }
    if (`match` in v && v[`match`] === `any` && `value` in v && Array.isArray(v[`value`])) {
      return [k, qualifiedPathsOf(Object.fromEntries(v[`value`].map(k => [k, k])), [...defaultPath, k])];
    }
    if (`match` in v && v[`match`] === `type` && `value` in v && v[`value`] === `boolean`) {
      return [k, (m: boolean = true) => objectFromPath([...defaultPath, k], m)];
    }
    if (`match` in v) {
      return [k, (m: unknown) => objectFromPath([...defaultPath, k], m)];
    }
    return [k, objectFromPath([...defaultPath, k], v)];
  }));
}

function mergeTraits(
  types: AlphabetInput[`types`],
  typeTraits: TraitsOf<AlphabetInput>,
  featureTraits: ReadonlyArray<{has: Record<string, MatchSchema>, traits: Record<string, MatchSchema>}>
): Alphabet[`traits`] {
  const typesArr = Object.keys(types);
  const matchingTypes = featureTraits.map(
    ({has}) => {
      const features = Object.entries(has);
      return typesArr.filter(
        type => features.every(
          ([feature, spec]) => types[type][feature] === spec
        )
      );
    }
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const merged: any = {};
  matchingTypes.forEach((types, idx) => {
    types.forEach(type => {
      if (merged[type] === undefined) {
        merged[type] = {};
      }
      merged[type] = {...merged[type], ...featureTraits[idx].traits};
    });
  });
  Object.entries(typeTraits).forEach(([name, traits]) => {
    if (merged[name] === undefined) {
      merged[name] = {};
    }
    merged[name] = {...merged[name], ...traits};
  });

  return merged;
}

// the idea behind extra traits: the rest parameter of this function can be used to define traits based
// on shared features
// this is handy when you have multiple types that contain some of the same features (like `root`)
// in order to implement it the first working way that i found was to split up the inferred array into two
// lke with `ExtraTraitsHas` and `ExtraTraitsTrait` below, will see tomorrow if they can be merged and
// retain inference
// i really don't like this in the future, it makes the alphabet() call long and messy
// what i'd much prefer is to define these kinds of things as variables above the actual function call
// but the problem is that then you don't get type inference unless you do `satisfies` or use an identity helper func...
// rip
export const alphabet = <
  const ABC extends AlphabetInput,
  const Traits extends TraitsOf<ABC>,
  const ExtraTraitsHas extends ReadonlyArray<Record<string, MatchSchema>>,
  const ExtraTraitsTrait extends {
    [Idx in keyof ExtraTraitsHas]: Record<
      string,
      // this threw the excessively-deep-and-possibly-infinite when i tried to get rid of the key
      // (eg if `has` is just {root: blah} what if u could say trait: {length: 3} instead of trait: {root: {length 3}})
      // but it's probably for the better this way
      ApplyMatchSchemaOf<ExtraTraitsHas[Idx]>
    >
  }
>(
    alphabet: ABC,
    traits: Traits,
    ...extraTraits: {
      [Idx in keyof ExtraTraitsHas]: {
        has: ExtraTraitsHas[Idx],
      }
    } & {
      [Idx in keyof ExtraTraitsTrait]:
        Idx extends number | `${number}`
          ? {traits: ExtraTraitsTrait[Idx]}
          // eslint-disable-next-line max-len
          // https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgMwgJwnAxhAQhA5gezggB4AVAPigF4oBtUgXXqggA9g0ATAZygFc4Aazj4A7nCgB+KAAYoALihEAbigYBuAFCbQkKAFkUuCAEFkyAIYhuxEy3ZdeAJQgXOhADYgzlkMQHCYnDkADRQWPYccDxQLm6e3uZW-kIi4uSUNAAUdgBk4QCUWjrg0ADqFsDUsa7ucF4+yS7o+MicxNzAyACWcLhhnT19GVq60FgARtUA3ppQ8wvztADSUL1QghAg+AhQFcAMiqtsUTFwfAC2EyhQAD5QAAYAJNPnVygAvg9SUNMTyHwABaKaa0ABSawkm22u32KwYh0eLzhyyYYIYHwAdC83tdkF8PmFRJVFLjPgo9pV4XMFh9RqUoKQIJ1gMQafMAGKRRw1eL1RK+YjNVrtQa9fpQMXDULs8Lc6K8WaLRYrSEbLY7KAcxHHBwKpSXPF3JGvQ2fb7SP4A4G-cFq6GajnwxHPaZO1HgjHY03vfEPQlQYnAUlm-EU90MWUfTSZAxGUxJazEDlhLDkel6JnMqo0Jkstn7EKaJXKpardYO2GVHXys6h42usl+n5WoEgu0VjVV4DOxSulFor040MEokkg2+j4U3WnXiV3l1BqJ4itm3CtodLrisKuqW4LHDycPUKB8dNj6UaRxRcC5KrxTr0Vbvo7l57g8+vFfE9BkOT8jwhSKgoFGMbFAgAjoMA3SEFAHCdD4bKLC0cCdFqtbOLUCSNH4j6bkMEp7hkRbIYQaERCcPIlqWqqdjCWo1pR+pZE2DaHl+DwFC2-xtraEJ0Y6vYmhGnofue-pjsGE5fkBECqMgoHkFkmIqRYyC4NwiiyqC5ZQl2DEgoCFiaVq8IfNGiz5Dp9r6VgiLTEx3AwXAihYGZFlQJoXHTFAqDAHwyASGpGnqFAdLaChaGiEZwA+NU8GxeYWTaUZJnTBYigAOQTJlAaOc5II8Ta6V9hMmIAKwSaeUkAMzmUWRTaGMjIQK1aE0GMmrRZUcVMTEvRIMgUC9XqMTXthy4BGkwQtrRen0T4iI+IBfW8ANNwAPI-Ftq38KkQSzfx82ahtiIbaJsnyZd5KknJKDFCUegAKpwN01RZAAjMaABMXG7etQ1PT8QO7VNB2WhlUBPVOt1XbD92PdAeY5nG6kJr4Ni0NRAD02MAHqSLKqUgrKiyoHyXhQJDABEEzU1oizhR8DBhFjsr5YQJOlvM5M3lARVc9zZNYfyVOKLTFX06TtIM9zvMJNVig1bL8xMwwlD-YgNwjbOC4TYKYPpLNunqgt5hLeYZnXcg6hAA
          : never
    }
  ): {
  name: ABC[`name`]
  types: NormalizeTypes<ABC[`types`]>
  context: NormalizeToMatch<ABC[`context`]>
  traits: MergedTraits<ABC, Traits, typeof extraTraits>
} => ({
    name: alphabet.name,
    context: normalizeToMatch(alphabet.context),
    types: Object.fromEntries(
      Object.entries(alphabet.types).map(([k, v]) => [k, normalizeToMatch(v)])
    ) as NormalizeTypes<ABC[`types`]>,
    traits: mergeTraits(
      alphabet.types,
      traits,
      extraTraits as ReadonlyArray<{has: Record<string, MatchSchema>, traits: Record<string, MatchSchema>}>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
  });
  
export function letters<
  const ABC extends Alphabet,
  const Context extends Record<string, ApplyMatchAsType<ABC[`context`]>>,
  const Symbols extends {
    [T in keyof ABC[`types`]]: Record<string, ApplyMatchAsType<ABC[`types`][T]>>
  }
>(
  alphabet: ABC,
  contextMap: Context,
  symbols: Symbols
): {
  [C in keyof Context]: {
    [T in keyof ABC[`types`]]: {
      [S in keyof Symbols[T]]: {
        type: T,
        features: Symbols[T][S],
        context: Context[C]
      }
    }
  }
} {
  return Object.fromEntries(
    Object.entries(contextMap).map(([c, context]) => [
      c,
      Object.fromEntries(
        Object.keys(alphabet.types).map(type => [
          type,
          Object.fromEntries(
            Object.entries(symbols[type]).map(([s, features]) => [
              s,
              {
                type,
                features,
                context,
              },
            ])
          ),
        ])
      ),
    ])
  ) as never;
}

type FillAbbreviations<
  Type extends Record<string, MatchInstance<`any`, ReadonlyArray<string>>>,
  Order extends ReadonlyArray<keyof Type>,
  Abbreviations extends Partial<{
    [Key in Order[number]]: Record<Type[Key][`value`][number], string>
  }>
> = {
  [Key in Order[number]]:
    Key extends keyof Abbreviations
      ? Exclude<Abbreviations[Key], undefined>
      : {[K in Type[Key][`value`][number]]: K}
}

// [`foo`, `bruh`], {bruh: {bruv: `brub`}, foo: {bar: `baz`, spam: `eggs`}}
// =>
// [{baz: {foo: `bar`}, eggs: {foo: `spam`}}, {brub: {bruh: `bruv`}}]
type OrderAbbreviations<
  Type extends Record<string, MatchInstance<`any`, ReadonlyArray<string>>>,
  Order extends ReadonlyArray<keyof Type>,
  Abbreviations extends Record<Order[number], Record<Type[keyof Type][`value`][number], string>>
> = {
  [Index in keyof Order]: ValuesOf<{
    [OriginalKey in keyof Abbreviations[Order[Index]]]: {
      [Abbreviation in Abbreviations[Order[Index]][OriginalKey]]: {
        [I in Order[Index]]: OriginalKey
      }
    }
  }>
};

type CombineAbbreviations<Arr, Key extends string = ``, Obj extends Record<string, string> = {}> =
  Arr extends readonly [infer Head, ...infer Tail]
    ? Head extends Record<string, Record<string, string>>
      ? CombineAbbreviations<Tail, `${Key}${string & keyof Head}`, Obj & Head[keyof Head]>
      : never
    : {[K in `${Key}`]: Obj};

type GenerateLetters<
  Type extends Record<string, MatchInstance<`any`, ReadonlyArray<string>>>,
  Order extends ReadonlyArray<keyof Type>,
  Abbreviations extends Partial<{
    [Key in Order[number]]: Record<Type[Key][`value`][number], string>
  }>
> = UnionToIntersection<
  CombineAbbreviations<
    OrderAbbreviations<
      Type,
      Order,
      FillAbbreviations<Type, Order, Abbreviations>
    >
  >
>;

export function generateLetters<
  const Type extends Record<string, MatchInstance<`any`, ReadonlyArray<string>>>,
  const Order extends ReadonlyArray<keyof Type>,
  const Abbreviations extends Partial<{
    [Key in Order[number]]: Record<Type[Key][`value`][number], string>
  }> = object
>(type: Type, order: Order, abbreviations?: Abbreviations): GenerateLetters<Type, Order, Abbreviations> {
  const [key, ...rest] = order;

  // TODO this should be a do-while loop ofc
  let acc = {} as Record<string, Record<string, string>>;
  const symbols = type[key].value;
  const replacements = (key in (abbreviations ?? {}) ? abbreviations![key] : {}) as Record<(typeof symbols)[number], string>;
  symbols.forEach(symbol => {
    acc[symbol in replacements ? replacements[symbol] : symbol] = {[key]: symbol};
  });

  rest.forEach(key => {
    const newAcc = {} as Record<string, Record<string, string>>;
    const symbols = type[key].value;
    const replacements = (key in (abbreviations ?? {}) ? abbreviations![key] : {}) as Record<(typeof symbols)[number], string>;
    symbols.forEach(symbol => {
      Object.entries(acc).forEach(([oldKey, oldValue]) => {
        newAcc[`${oldKey}${symbol in replacements ? replacements[symbol] : symbol}`] = Object.assign(oldValue, {[key]: symbol});
      });
    });
    acc = newAcc;
  });

  return acc as never;
}
