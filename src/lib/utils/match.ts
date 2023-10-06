// broken: MatchAsType<MatchesExtending<{a: 4}>>, InferArrayType<readonly MatchSchemaOf<4 | null>[]>
// weirdly MatchAsType<MatchesExtending<null | {a: 4}>> is fine
// these are eminently fixable but right now it's not a priority
// btw can maybe do better than MatchAsType<MatchSchemaOf<4>> resolving to number

import {Merge, MergeUnion, ValuesOf} from "./typetools";

export type Guards = {
  string: string
  number: number
  bigint: bigint
  boolean: boolean
  symbol: symbol
  undefined: undefined
  null: null
};
type Danger = {
  primitive: ValuesOf<Guards>
  object: {[key: string]: ValuesOf<Danger>}
  array: {length: number, [index: number]: ValuesOf<Danger>}
}
type Primitive = ValuesOf<Guards>;

export type Match =
  | {
    readonly match: `single`
    readonly value: MatchSchema
  } | {
    readonly match: `literal`
    readonly value: MatchSchema
  } | {
    readonly match: `any`
    readonly value: ReadonlyArray<MatchSchema>
  } | {
    readonly match: `all`
    readonly value: ReadonlyArray<MatchSchema>
  } | {
    readonly match: `type`
    readonly value: keyof Guards
  } | {
    readonly match: `danger`
    readonly value: keyof Danger
  } | {
    readonly match: `array`
    readonly value: {
      length: number | MatchesExtending<number>
      fill: MatchSchema
    }
  } | {
    readonly match: `custom`
    readonly value: (arg: never) => boolean
  };

export type PickMatch<M extends Match[`match`]> = Extract<Match, {match: M}>;
export type ValueOfMatch<M extends Match[`match`]> = PickMatch<M>[`value`];
export type MatchInstance<M extends Match[`match`], V> = {match: M, value: V};

type MatchesExtendingTuple<T> =
  T extends readonly [infer Head extends MatchSchema, ...infer Tail extends ReadonlyArray<MatchSchema>]
  ? readonly [Head | MatchesExtending<Head>, ...MatchesExtendingTuple<Tail>]
  : readonly [];

export type MatchesExtending<T> =
  | (
    [T] extends [Match] ? (
      | T
      | PartialMatchAsType<T>
      | (T extends PickMatch<`single`> ? never : MatchInstance<`single`, PartialMatchAsType<T>>)
      | (T extends PickMatch<`array`> ? MatchInstance<`array`, {
          length: T[`value`][`length`] | MatchesExtending<T[`value`][`length`]>,
          fill: T[`value`][`fill`] | MatchesExtending<T[`value`][`fill`]>
        }> : never)
      | MatchInstance<`any`, ReadonlyArray<MatchSchemaOf<T>>>
      | MatchInstance<`all`, ReadonlyArray<MatchSchemaOf<T>>>
      | MatchInstance<`custom`, (arg: MatchAsType<T>) => boolean>
    )
    : [T] extends [MatchSchema] ? (
      | MatchInstance<`single`, Partial<T>>
      | MatchInstance<`any`, ReadonlyArray<T | MatchSchemaOf<T>>>
      | MatchInstance<`all`, ReadonlyArray<T | MatchSchemaOf<T>>>
      | MatchInstance<`custom`, (arg: MatchAsType<T>) => boolean>
      | (T extends Record<string, unknown> ? {[K in keyof T]: MatchesExtending<T[K]>} : never)
    ) : never
  )
  | (
    T extends readonly [infer Head extends MatchSchema, ...infer Tail extends ReadonlyArray<MatchSchema>]
    ? (
      | MatchesExtendingTuple<T>
      | (Tail[number] extends Head ? MatchInstance<`array`, {length: T[`length`], fill: MatchSchemaOf<Head>}> : never)
    )
    : T extends ReadonlyArray<infer U extends MatchSchema>
    ? MatchInstance<`array`, {length: T[`length`] | MatchesExtending<T[`length`]>, fill: U | MatchesExtending<U>}>
    : never
  )
  | (boolean extends T ? MatchInstance<`type`, `boolean`> : never)
  | {[K in keyof Guards]: T extends Guards[K] ? MatchInstance<`type`, K> : never}[keyof Guards]
  | {[K in keyof Danger]: T extends Danger[K] ? MatchInstance<`danger`, K> : never}[keyof Danger];

type InferArrayType<
  Arr extends ReadonlyArray<unknown>
> = Arr extends ReadonlyArray<(infer U) | (MatchInstance<Match[`match`], infer U>)>
  ? MatchAsType<
    | Exclude<U,
      | keyof Guards
      | Match
      | ReadonlyArray<unknown>
      | ((...args: never) => boolean)
    >
    | (U extends unknown ? string extends U ? string : never : never)
  > : never;

type PartialInferArrayType<
  Arr extends ReadonlyArray<unknown>
> = Arr extends ReadonlyArray<(infer U) | (MatchInstance<Match[`match`], infer U>)>
  ? PartialMatchAsType<
    | Exclude<U,
      | string
      | Match
      | ReadonlyArray<unknown>
      | ((...args: never) => boolean)
    >
    | (U extends unknown ? string extends U ? string : never : never)
  > : never;

type MergeArray<Arr extends ReadonlyArray<unknown>> =
  Arr extends readonly [infer Head] ? MatchAsType<Head>
  : Arr extends readonly [infer Head, ...infer Tail]
    ? Merge<MatchAsType<Head>, MergeArray<Tail>> /*: never  // copout */
    : number extends Arr[`length`]
      ? MergeUnion<InferArrayType<Arr>>
      : never;

type PartialMergeArray<Arr extends ReadonlyArray<unknown>> =
Arr extends readonly [infer Head] ? PartialMatchAsType<Head>
: Arr extends readonly [infer Head, ...infer Tail]
  ? Merge<PartialMatchAsType<Head>, MergeArray<Tail>> /*: never  // copout */
  : number extends Arr[`length`]
    ? MergeUnion<InferArrayType<Arr>>
    : never;

export type MatchAsType<T> =
  Match extends T ? Exclude<Match[`value`], Match>
  : T extends PickMatch<`danger`> ? never
  : T extends PickMatch<`array`> ? {
    readonly length: MatchAsType<T[`value`][`length`]>
    readonly [index: number]: MatchAsType<T[`value`][`fill`]>
    [Symbol.iterator](): Iterator<MatchAsType<T[`value`][`fill`]>>
  }
  : T extends PickMatch<`type`> ? Guards[T[`value`]]
  : T extends PickMatch<`custom`> ? Parameters<T[`value`]>[number]
  : T extends PickMatch<`any`>
    ? number extends T[`value`][`length`] /*? never  // copout */
      ? InferArrayType<T[`value`]>
      : MatchAsType<T[`value`][number]>
  : T extends PickMatch<`all`> ? MatchAsType<MergeArray<T[`value`]>>
  : T extends PickMatch<`single`> ? MatchAsType<T[`value`]>
  : T extends Record<string, unknown> ? {[K in keyof T]: MatchAsType<T[K]>}
  : T;

export type PartialMatchAsType<T> =
  Match extends T ? Partial<Exclude<Match[`value`], Match>>
  : T extends PickMatch<`danger`> ? never
  : T extends PickMatch<`array`> ? {
    readonly length?: PartialMatchAsType<T[`value`][`length`]>
    readonly [index: number]: PartialMatchAsType<T[`value`][`fill`]>
    [Symbol.iterator]?(): Iterator<PartialMatchAsType<T[`value`][`fill`]>>
  }
  : T extends PickMatch<`type`> ? Guards[T[`value`]]
  : T extends PickMatch<`custom`> ? Parameters<T[`value`]>[number]
  : T extends PickMatch<`any`>
    ? number extends T[`value`][`length`] /*? never  // copout */
      ? PartialInferArrayType<T[`value`]>
      : PartialMatchAsType<T[`value`][number]>
  : T extends PickMatch<`all`> ? PartialMatchAsType<PartialMergeArray<T[`value`]>>
  : T extends PickMatch<`single`> ? PartialMatchAsType<T[`value`]>
  : T extends Record<string, unknown> ? {[K in keyof T]?: PartialMatchAsType<T[K]>}
  : T extends ((...args: never) => unknown) ? T  // Partial<some function type> is never (??)
  : Partial<T>;

export type MatchSchema =
  | null
  | ((...args: never) => unknown)
  | Primitive
  | Match
  | ReadonlyArray<MatchSchema>
  | {[key: string]: MatchSchema};

export type MatchSchemaOf<O extends MatchSchema> =
  // | O
  | MatchesExtending<O>
  | PartialMatchAsType<O>
  | (
    O extends readonly [] ? never
    : O extends readonly [infer Head extends MatchSchema, ...infer Tail extends ReadonlyArray<MatchSchema>] ?
      {readonly [K in Partial<O>[`length`] & number]?: MatchSchemaOf<O[K]>}
      & {readonly length?: MatchSchemaOf<O[`length`]>}
    : O extends ReadonlyArray<infer U extends MatchSchema> ? ReadonlyArray<MatchSchemaOf<U>>
    : O extends Match ? never
    : O extends {[key: string]: MatchSchema} ? {readonly [K in keyof O]?: MatchSchemaOf<O[K]>}
    : never
  );

export type SafeMatchSchemaOf<O extends MatchSchema> = MatchSchemaOf<O> extends infer Deferred ? Deferred : never;

function isLiteral(o: unknown): o is Record<string, unknown> {
  return o !== null && o !== undefined && Object.getPrototypeOf(o) === Object.prototype;
}

export const matchers = {
  single<const Self extends ValueOfMatch<`single`>>(self: Self, other: unknown): other is MatchAsType<Self> {
    if (isLiteral(self) && `match` in self && `value` in self) {
      if (typeof self.match === `string` && self.match in matchers) {
        return (matchers[self.match as keyof typeof matchers] as CallableFunction)(self.value, other);
      }
    }
    return matchers.literal(self, other);
  },
  literal<const Self extends ValueOfMatch<`literal`>>(self: Self, other: unknown): other is MatchAsType<Self> {
    if (Array.isArray(self)) {
      if (!Array.isArray(other)) {
        return false;
      }
      return self.every((item, idx) => item === other[idx]);
    }
    if (isLiteral(self)) {
      if (!isLiteral(other)) {
        return false;
      }
      return Object.keys(self).every(
        k => k in other && matchers.single(
          (self as Record<string, MatchSchema>)[k],
          other[k]
        )
      );
    }
    return self === other;
  },
  any<const Self extends ValueOfMatch<`any`>>(self: Self, other: unknown): boolean {
    return self.some(item => matchers.single(item, other));
  },
  all<const Self extends ValueOfMatch<`all`>>(self: Self, other: unknown): boolean {
    return self.every(item => matchers.single(item, other));
  },
  type<const Self extends ValueOfMatch<`type`>>(self: Self, other: unknown): other is Guards[Self] {
    if (self === `null`) {
      return other === null;
    }
    return typeof other === self;
  },
  danger<const Self extends ValueOfMatch<`danger`>>(self: Self, other: unknown): other is Danger[Self] {
    if (self === `object`) {
      return other !== null && typeof other === `object`;
    }
    if (self === `array`) {
      return Array.isArray(other);
    }
    if (self === `primitive`) {
      return other === null || typeof other !== `object`;
    }
    return false;
  },
  array<const Self extends ValueOfMatch<`array`>>({length, fill}: Self, other: unknown): boolean {
    return Array.isArray(other) && this.single({length}, other) && other.every(item => item === fill);
  },
  custom<const Self extends ValueOfMatch<`custom`>>(self: Self, other: unknown): boolean {
    // XXX: more elegant way to make the compiler happy here?
    return self(other as never);
  },
} satisfies {[M in Match as M[`match`]]: <const Self extends M[`value`]>(self: Self, other: unknown) => boolean};
