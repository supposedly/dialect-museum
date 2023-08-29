import type {Merge} from "ts-toolbelt/out/Object/Merge";

type ValuesOf<O> = O[keyof O];
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? (U extends any ? I extends U ? I : never : never) : never;

export type Guards = {
  string: string
  number: number
  bigint: bigint
  boolean: boolean
  symbol: symbol
  undefined: undefined
  null: null,
  any: ValuesOf<Omit<Guards, `any`>> | {[key: number]: Guards[`any`]} & {length: number} | {[key: string]: Guards[`any`]}
};
type Primitive = ValuesOf<Guards>;
type PrimitiveToString<
  T extends Primitive,
  _Helper = keyof Guards,
  _GuardsEntries = (_Helper extends keyof Guards ? [_Helper, Guards[_Helper]] : never)
> = _GuardsEntries extends [infer S, T] ? S : never;

export type Match =
  | {
    match: `single`
    value: MatchSchema
  } | {
    match: `literal`
    value: MatchSchema
  } | {
    match: `any`
    value: ReadonlyArray<MatchSchema>
  } | {
    match: `all`
    value: ReadonlyArray<MatchSchema>
  } | {
    match: `guard`
    value: keyof Guards
  } | {
    match: `array`
    value: {
      length: number | MatchesExtending<number>
      fill: MatchSchema
    }
  } | {
    match: `custom`
    value: (other: never) => boolean
  };

type PickMatch<M extends Match[`match`]> = Extract<Match, {match: M}>;
type ValueOfMatch<M extends Match[`match`]> = PickMatch<M>[`value`];
type MatchInstance<M extends Match[`match`], V extends ValueOfMatch<M> = ValueOfMatch<M>> = {match: M, value: V};
type ArrayTypeMatchInstance<V extends {length: unknown, fill: unknown}> = V extends ValueOfMatch<`array`> ? {match: `array`, value: V} : never;
type UMatchInstance<M extends Match[`match`], V> = {match: M, value: V}

type MatchesExtendingTuple<T> =
  T extends readonly [infer Head extends MatchSchema, ...infer Tail extends ReadonlyArray<MatchSchema>]
  ? readonly [Head | MatchesExtending<Head>, ...MatchesExtendingTuple<Tail>]
  : [];

export type MatchesExtending<T, _Primitive extends Primitive = Primitive> =
  | (
    T extends Match ? (
      | T
      | UMatchInstance<`single`, T | Partial<MatchAsType<T>>>
      | UMatchInstance<`any`, ReadonlyArray<T | Partial<MatchAsType<T>> | MatchesExtending<T>>>
      | UMatchInstance<`all`, ReadonlyArray<T | Partial<MatchAsType<T>> | MatchesExtending<T>>>
      | UMatchInstance<`custom`, (arg: MatchAsType<T>) => boolean>
    ) //MatchSubtypes<T> | MatchInstance<`custom`, (arg: MatchAsType<T>) => boolean>
    : T extends MatchSchema ? (
      | MatchInstance<`single`, T>
      | MatchInstance<`any`, ReadonlyArray<T>>
      | MatchInstance<`all`, ReadonlyArray<T>>
      | MatchInstance<`custom`, (arg: T) => boolean>
    ) : never
  )
  | (
    T extends readonly [infer Head extends MatchSchema, ...infer Tail extends ReadonlyArray<MatchSchema>]
    ? (
      | MatchesExtendingTuple<T>
      | (Tail[number] extends Head ? ArrayTypeMatchInstance<{length: T[`length`], fill: MatchSchemaOf<Head>}> : never)
    )
    : T extends ReadonlyArray<infer U extends MatchSchema>
    ? MatchInstance<`array`, {length: T[`length`], fill: U}>
    : never
  )
  | (boolean extends T ? MatchInstance<`guard`, `boolean`> : never)
  | (_Primitive extends T ? T extends Primitive ? MatchInstance<`guard`, PrimitiveToString<T>> : never : never);

type MergeArray<Arr extends ReadonlyArray<unknown>> = Arr extends readonly [infer Head extends object, ...infer Tail] ? Merge<MatchAsType<Head>, MergeArray<Tail>> : {};

export type DeepMatchAsType<T> = {[K in keyof T]: DeepMatchAsType<MatchAsType<T[K]>>};
export type MatchAsType<T> =
  T extends MatchInstance<`array`> ? {readonly length: MatchAsType<T[`value`][`length`]>} & Readonly<ArrayLike<MatchAsType<T[`value`][`fill`]>>>
  : T extends MatchInstance<`guard`> ? Guards[T[`value`]]
  : T extends MatchInstance<`custom`> ? T[`value`]
  : T extends MatchInstance<`any`> ? MatchAsType<T[`value`][number]>
  : T extends MatchInstance<`all`> ? MatchAsType<MergeArray<T[`value`]>>
  : T extends MatchInstance<`single`> ? MatchAsType<T[`value`]>
  : T;

export type MatchSchema =
  | Primitive
  | Match
  | ReadonlyArray<MatchSchema>
  | {[key: string]: MatchSchema}
  | ((arg: never) => boolean);

  export type MatchSchemaOf<O extends MatchSchema> =
  | O
  | MatchesExtending<O>
  | MatchAsType<O>
  | (
    O extends readonly [] ? never
    : O extends readonly [infer Head extends MatchSchema, ...infer Tail extends ReadonlyArray<MatchSchema>] ? {readonly [K in Exclude<Partial<O>[`length`], undefined>]?: MatchSchemaOf<O[K]>} & {readonly length?: MatchSchemaOf<O[`length`]>}
    : O extends ReadonlyArray<infer U extends MatchSchema> ? ReadonlyArray<MatchSchemaOf<U>>
    : O extends {[key: string]: MatchSchema} ? {readonly [K in keyof O]?: MatchSchemaOf<O[K]>}
    : never
  );

const matchFactory = <const T extends Match[`match`]>(match: T) => {
  return <const V extends ValueOfMatch<T>>(value: V) => ({
    match,
    value,
  });
};

export const match: {[M in Match as M[`match`]]: <const T extends M[`value`]>(value: T) => {match: M[`match`], value: T}} = {
  single: matchFactory(`single`),
  literal: matchFactory(`literal`),
  any: matchFactory(`any`),
  all: matchFactory(`all`),
  array: matchFactory(`array`),
  guard: matchFactory(`guard`),
  custom: matchFactory(`custom`),
};

function isLiteral(o: any): o is Record<string, any> {
  return o && Object.getPrototypeOf(o) === Object.prototype;
}

export const matchers = {
  single<const Self extends ValueOfMatch<`single`>>(self: Self, other: unknown): boolean {
    if (matchers.literal(
      {
        match: {match: `any`, value: Object.keys(this) as ReadonlyArray<Match[`match`]>},
        value: {match: `guard`, value: `any`},
      },
      self
    )) {
      return (this[self[`match`]] as any)(self[`value`], other);
    }
    return this.literal(self, other);
  },
  literal<const Self extends ValueOfMatch<`literal`>>(self: Self, other: unknown): other is DeepMatchAsType<Self> {
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
      return Object.keys(self).every(k => k in other && this.single((self as any)[k], other[k]))
    }
    return self === other;
  },
  any<const Self extends ValueOfMatch<`any`>>(self: Self, other: unknown): boolean {
    return self.some(item => this.single(item, other));
  },
  all<const Self extends ValueOfMatch<`all`>>(self: Self, other: unknown): boolean {
    return self.every(item => this.single(item, other));
  },
  guard<const Self extends ValueOfMatch<`guard`>>(self: Self, other: unknown): other is Guards[Self] {
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


/*
const arrayTest = {match: `array`, value: {length: {match: `guard`, value: `number`}, fill: {a: {match: `any`, value: [1, 2, 3]}}}} as const satisfies MatchSchema;
const array2 = {match: ``} satisfies MatchSchemaOf<MatchAsType<typeof arrayTest>>;
declare const bruv: any;
if (matchers.literal({match: `any`, value: Object.keys(matchers) as ReadonlyArray<Match[`match`]>} as const, bruv)) {
  bruv
}

type Uh = MatchAsType<{
  match: {match: `any`, value: ReadonlyArray<Match[`match`]>},
  value: {match: `guard`, value: `any`}
}>;


export function matches<Self extends MatchSchema>(self: Self, other: unknown) { }

const oops = 5 satisfies MatchSchema;
const eewr = {} as const as any satisfies MatchSchemaOf<typeof oops>;

const bruh = {a: {match: `array`, value: {length: {match: `guard`, value: `number`}, fill: {match: `guard`, value: `number`}}}} as const satisfies MatchSchema;
const brudv = {a: {match: `custom`, value: arg => true}} as const satisfies MatchSchemaOf<typeof bruh>;

type Frick = MatchSchemaOf<1[]>;
const freck = {match: `custom`, value: arg => arg[2] === arg[1]} satisfies Frick;

// type tset<O> = {readonly [K in keyof O]+?: MatchSchemaOf<O[K]>};

const test = {a: [1, 2, [{match: `any`, value: [3, 4]}]]} as const satisfies MatchSchema;
const test4 = {a: {match: `array`, value: {length: 3, fill: {match: `any`, value: [1, 3]}}}} as const satisfies MatchSchema;
const test5 = {a: {match: `array`, value: {length: 3, fill: {match: `any`, value: [1]}}}} as const satisfies MatchSchemaOf<typeof test4>;

const test3 = {a: [{match: `any`, value: [1, 2, 3]}, {match: `any`, value: [1, 2, 3]}, {match: `any`, value: [1, 2, 3]}]} as const satisfies MatchSchema;
const test2 = {a: {match: `array`, value: {length: 3, fill: {match: `any`, value: [1, 2]}}}} as const satisfies MatchSchemaOf<typeof test3>;


type DistPartial<T> = T extends unknown ? Partial<T> : never;
const partialtest = {a: 1, b: {c: [2, 3, 4], d: 1}} as const satisfies MatchSchema;
const partialtest2 = {a: 1, b: {c: {length: 3}, d: 1}} as const satisfies MatchSchemaOf<typeof partialtest>;

const tewtewt = {0: 1} as const satisfies MatchSchemaOf<readonly [1, 2, 3]>;

type E = MatchSchemaOf<readonly [1, 2, 3]>;
type F = MatchSchemaOf<readonly [1, 1, 1]>;
const Tereewrwerwerw = {match: `array`, value: {length: 3, fill: 5}} as const satisfies MatchSchemaOf<ReadonlyArray<1 | 2 | 3>>;
const test254wwrwer = {match: `array`, value: {length: 3, fill: 1}} as const satisfies MatchSchemaOf<ReadonlyArray<1 | 2 | 3>>;
const Tereewrwerwerw2 = {match: `sdlkfjaskljf`, toString: null} as const satisfies E;
const Tereewrwerwedrw2 = [{match: `single`, value: 2}, 2, 3] as const satisfies E;
const fn = <const O extends E>(o: O) => o;
const fn2 = <const O extends F>(o: O) => o;
const test53 = fn([{match: `single`, value: 1}, 2, 3]) satisfies E;
const test25 = fn({match: `array`, value: {length: 3, fill: 1}}) satisfies E;
const test245 = fn2({match: `array`, value: {length: 3, fill: 1}}) satisfies F;
const test35 = fn([1, 2, 43]) satisfies E;
const test353 = fn({length: 3}) satisfies E;
const test33 = fn({length: 2}) satisfies E;

// type Bug = Partial<{a: `b`, [x: number]: number}>;
type NonHomomorphicPartial<T> = {[K in keyof T & {}]?: T[K]}


const tetet = {foo: `bar`} as const satisfies {};

type D<T> = T extends readonly [] | readonly [infer Head, ...infer Tail] ? {[K in Exclude<Partial<T>[`length`], undefined>]?: Partial<T[K]>} & {length?: T[`length`]} : false;

type ER = D<[1, 2]>

type What = MatchesExtending<2 | 1 | 3>;

const a = {a: 1, b: {match: `array`, value: {length: {match: `guard`, value: `number`}, fill: {match: `any`, value: [1, 2, 3]}}}} as const satisfies MatchSchema;
const b = {a: 1, b: {match: `array`, value: {length: {match: `guard`, value: `number`}, fill: 1}}} as const satisfies MatchSchemaOf<typeof a>;
const c = {a: 1, b: {match: `array`, value: {length: {match: `guard`, value: `number`}, fill: {match: `any`, value: [2, 3]}}}} as const satisfies MatchSchemaOf<typeof a>;
const d = {a: 1, b: {match: `array`, value: {length: {match: `any`, value: [5, 6, 7]}, fill: 3}}} as const satisfies MatchSchemaOf<typeof a>;
const e = {
  b: [1, 2, 3, 2, 3],
} as const satisfies MatchSchemaOf<typeof a>;
const f = {
  a: 1,
  b: [3, 3, 3, 3, 3],
} as const satisfies MatchSchemaOf<typeof d>;
const g = {
  a: 1,
  b: {4: 3},
} as const satisfies MatchSchemaOf<typeof f>;

const fna = {a: 1, b: match.array({length: match.guard(`number`), fill: match.any([`1`, `2`, `3`, 1, 2, 3])})} as const satisfies MatchSchema;
const fnb = {a: 1, b: match.array({length: match.guard(`number`), fill: `1`})} as const satisfies MatchSchemaOf<typeof fna>;
const fnc = {a: 1, b: match.array({length: match.guard(`number`), fill: match.any([`2`, `3`])})} as const satisfies MatchSchemaOf<typeof fna>;
const fnd = {a: 1, b: match.array({length: {match: `single`, value: 5}, fill: {match: `single`, value: 3}})} as const satisfies MatchSchemaOf<typeof fna>;
const fne = {
  b: [1, 2, 3, 2, 3],
} as const satisfies MatchSchemaOf<typeof fna>;
const fnf = {
  a: 1,
  b: [3, 3, 3, 3, 3],
} as const satisfies MatchSchemaOf<typeof fnd>;
const fng = {
  a: 1,
  b: {4: 3},
} as const satisfies MatchSchemaOf<typeof fnf>;

const tetetst = {match: `all`, value: [{match: `any`, value: [{a: 1}, {b: 1}]}, {c: 1}]} as const satisfies MatchSchema;
type Huh = MatchSchemaOf<typeof tetetst>;
const etetst2 = {a: 1, b: 1, c: 1} as const satisfies MatchSchemaOf<typeof tetetst>;
*/
