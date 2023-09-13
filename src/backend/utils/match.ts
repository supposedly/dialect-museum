type ValuesOf<O> = O[keyof O];

export type Guards = {
  string: string
  number: number
  bigint: bigint
  boolean: boolean
  symbol: symbol
  undefined: undefined
  null: null,
  any:
    | ValuesOf<Omit<Guards, `any`>>
    | {length: number, [index: number]: Guards[`any`]}
    | {[key: string]: Guards[`any`]}
};
type Primitive = ValuesOf<Guards>;
type PrimitiveToString<
  T extends Primitive,
  _Helper = keyof Guards,
  _GuardsEntries = (_Helper extends keyof Guards ? [_Helper, Guards[_Helper]] : never)
> = _GuardsEntries extends [infer S, T] ? S : never;

export type Match =
  | {
    readonly match: `single`
    value: MatchSchema
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
    readonly match: `array`
    readonly value: {
      length: number | MatchesExtending<number>
      fill: MatchSchema
    }
  } | {
    readonly match: `custom`
    readonly value: (other: never) => boolean
  };

export type PickMatch<M extends Match[`match`]> = Extract<Match, {match: M}>;
export type ValueOfMatch<M extends Match[`match`]> = PickMatch<M>[`value`];
export type MatchInstance<M extends Match[`match`], V> = {match: M, value: V};

type MatchesExtendingTuple<T> =
  T extends readonly [infer Head extends MatchSchema, ...infer Tail extends ReadonlyArray<MatchSchema>]
  ? readonly [Head | MatchesExtending<Head>, ...MatchesExtendingTuple<Tail>]
  : readonly [];

export type MatchesExtending<T, _Primitive extends Primitive = Primitive> =
  | (
    [T] extends [Match] ? (
      | T
      | Partial<MatchAsType<T>>
      | (T extends PickMatch<`single`> ? never : MatchInstance<`single`, T | PartialMatchAsType<T>>)
      | (T extends PickMatch<`array`> ? MatchInstance<`array`, {
          length: T[`value`][`length`] | MatchesExtending<T[`value`][`length`]>,
          fill: T[`value`][`fill`] | MatchesExtending<T[`value`][`fill`]>
        }> : never)
      | MatchInstance<`any`, ReadonlyArray<T | MatchSchemaOf<T>>>
      | MatchInstance<`all`, ReadonlyArray<T | MatchSchemaOf<T>>>
      | MatchInstance<`custom`, (arg: MatchAsType<T>) => boolean>
    ) //MatchSubtypes<T> | MatchInstance<`custom`, (arg: MatchAsType<T>) => boolean>
    : [T] extends [MatchSchema] ? (
      | MatchInstance<`single`, Partial<T>>
      | MatchInstance<`any`, ReadonlyArray<T | MatchSchemaOf<T>>>
      | MatchInstance<`all`, ReadonlyArray<T | MatchSchemaOf<T>>>
      | MatchInstance<`custom`, (arg: T) => boolean>
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
    ? MatchInstance<`array`, {length: T[`length`], fill: U}>
    : never
  )
  | (boolean extends T ? MatchInstance<`type`, `boolean`> : never)
  | (_Primitive extends T ? T extends Primitive ? MatchInstance<`type`, PrimitiveToString<T>> : never : never);


type Merge<A, B> = {
  [K in keyof A | keyof B]: 
    K extends keyof A & keyof B
    ? A[K] | B[K]
    : K extends keyof B
    ? B[K]
    : K extends keyof A
    ? A[K]
    : never;
};
type MergeArray<Arr extends ReadonlyArray<unknown>> =
  Arr extends readonly [infer Head] ? MatchAsType<Head>
  : Arr extends readonly [infer Head, ...infer Tail] ? Merge<MatchAsType<Head>, MergeArray<Tail>>
  : never;

export type MatchAsType<T> =
  T extends PickMatch<`array`> ? {
    readonly length: MatchAsType<T[`value`][`length`]>
    readonly [index: number]: MatchAsType<T[`value`][`fill`]>
    [Symbol.iterator](): Iterator<MatchAsType<T[`value`][`fill`]>>
  }
  : T extends PickMatch<`type`> ? Guards[T[`value`]]
  : T extends PickMatch<`custom`> ? T[`value`]
  : T extends PickMatch<`any`> ? MatchAsType<T[`value`][number]>
  : T extends PickMatch<`all`> ? MatchAsType<MergeArray<T[`value`]>>
  : T extends PickMatch<`single`> ? MatchAsType<T[`value`]>
  : T extends Record<string, unknown> ? {[K in keyof T]: MatchAsType<T[K]>}
  : T;

export type PartialMatchAsType<T> =
  T extends PickMatch<`array`> ? {
    readonly length?: PartialMatchAsType<T[`value`][`length`]>
    readonly [index: number]: PartialMatchAsType<T[`value`][`fill`]>
    [Symbol.iterator]?(): Iterator<PartialMatchAsType<T[`value`][`fill`]>>
  }
  : T extends PickMatch<`type`> ? Guards[T[`value`]]
  : T extends PickMatch<`custom`> ? T[`value`]
  : T extends PickMatch<`any`> ? PartialMatchAsType<T[`value`][number]>
  : T extends PickMatch<`all`> ? PartialMatchAsType<MergeArray<T[`value`]>>
  : T extends PickMatch<`single`> ? PartialMatchAsType<T[`value`]>
  : T extends Record<string, unknown> ? {[K in keyof T]?: PartialMatchAsType<T[K]>}
  : T;

export type MatchSchema =
  | Primitive
  | Match
  | ReadonlyArray<MatchSchema>
  | {[key: string]: MatchSchema}
  | ((arg: never) => boolean);

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
    if (self === `any`) {
      return true;
    }
    if (self === `null`) {
      return other === null;
    }
    return typeof other === self;
  },
  array<const Self extends ValueOfMatch<`array`>>({length, fill}: Self, other: unknown): boolean {
    return Array.isArray(other) && this.single({length}, other) && other.every(item => item === fill);
  },
  custom<const Self extends ValueOfMatch<`custom`>>(self: Self, other: unknown): boolean {
    // XXX: more elegant way to make the compiler happy here?
    return self(other as never);
  },
} satisfies {[M in Match as M[`match`]]: <const Self extends M[`value`]>(self: Self, other: unknown) => boolean};
