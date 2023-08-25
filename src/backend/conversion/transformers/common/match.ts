import {type ValuesOf} from "../../utils/typetools";
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? (U extends any ? I extends U ? I : never : never) : never;

type Guards = {
  string: string
  number: number
  bigint: bigint
  boolean: boolean
  symbol: symbol
};
type Primitive = ValuesOf<Guards>;
type PrimitiveToString<
  T extends Primitive,
  _Helper = keyof Guards,
  _GuardsEntries = _Helper extends keyof Guards ? [_Helper, Guards[_Helper]] : never
> = _GuardsEntries extends [infer S, T] ? S : never;

type ArrayOr<T> = T | ReadonlyArray<T>;

export type Match =
  | {
    match: `single`
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
    value: (arg: UnionToIntersection<ArrayOr<Primitive> | ArrayOr<Match>>) => boolean
  };

type PickMatch<M extends Match[`match`]> = Extract<Match, {match: M}>;
type ValueOfMatch<M extends Match[`match`]> = PickMatch<M>[`value`];
type MatchInstance<M extends Match[`match`], V extends ValueOfMatch<M> = ValueOfMatch<M>> = {match: M, value: V};

export type MatchSubtypes<T> =
  T extends MatchInstance<`single`> ? MatchInstance<`single`, T[`value`]>
  : T extends MatchInstance<`any`> ? MatchInstance<`single`, T[`value`][number]> | MatchInstance<`any`, ReadonlyArray<T[`value`][number]>>
  : T extends MatchInstance<`all`> ? MatchInstance<`single`, UnionToIntersection<T[`value`][number]>>
  : T extends MatchInstance<`guard`> ? MatchInstance<`single`, Guards[T[`value`]]> | MatchInstance<`any`, ReadonlyArray<Guards[T[`value`]]>>
  : T;

type MatchesExtendingTuple<T> =
  T extends readonly [infer Head extends MatchSchema, ...infer Tail extends ReadonlyArray<MatchSchema>]
    ? readonly [Head | MatchesExtending<Head>, ...MatchesExtendingTuple<Tail>]
    : never;

// Should this include T in the union?
// Every time I use this type I union it with whatever I pass in for T
// I am NOT sure if it's necessary in MatchesExtendingTuple (ie I'm not sure if the `Head | MatchesExtending<Head>` is
// necessary or if it can just be `MatchesExtending<Head>` -- it seems like the union is important but when I tried it
// with just `MatchesExtending<Head>` I couldn't find a way to break it... not sure why)
// But otherwise it's always necessary to union this type with whatever I pass in for T
// So should I just include said T in the union below and rename it to MatchesExtendingOr?
// (...or even to MatchOr like before lol)
export type MatchesExtending<T, _Primitive extends Primitive = Primitive> =
  | (
    T extends MatchInstance<infer _ extends Match[`match`]>
      ? MatchSubtypes<T>
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
        | (Tail[number] extends Head ? MatchInstance<`array`, {length: T[`length`], fill: Head | MatchesExtending<Head>}> : never)
      )
      : 
    T extends ReadonlyArray<infer U extends MatchSchema>
      ? MatchInstance<`array`, {length: T[`length`], fill: U | MatchesExtending<U>}>
      : never
  )
  | (boolean extends T ? PickMatch<`guard`> & {value: `boolean`} : never)
  | (_Primitive extends T ? T extends Primitive ? PickMatch<`guard`> & {value: PrimitiveToString<T>} : never : never);

export type MatchAsType<T> = 
  T extends MatchInstance<`array`> ? {readonly length: MatchAsType<T[`value`][`length`]>} & ReadonlyArray<MatchAsType<T[`value`][`fill`]>>
  : T extends MatchInstance<`guard`> ? Guards[MatchAsType<T[`value`]>]
  : T extends MatchInstance<`custom`> ? T[`value`]
  : T extends MatchInstance<`any`> ? T[`value`][number]
  : T extends MatchInstance<`all`> ? UnionToIntersection<T[`value`][number]>
  : T extends MatchInstance<`single`> ? T[`value`]
  : T;

type MatchSchema =
  | Primitive
  | Match
  | ReadonlyArray<MatchSchema>
  | {[key: string]: MatchSchema};

export type MatchSchemaOf<O> =
  | O
  | MatchesExtending<O>
  | MatchAsType<O>
  | (
    O extends readonly [] ? never
    : O extends readonly [infer Head, ...infer Tail] ? {readonly [K in Exclude<Partial<O>[`length`], undefined>]?: MatchSchemaOf<O[K]>} & {readonly length?: MatchSchemaOf<O[`length`]>}
    : O extends ReadonlyArray<infer U> ? ReadonlyArray<MatchSchemaOf<U>>
    : {readonly [K in keyof O]?: MatchSchemaOf<O[K]>}
  );

/*
type tset<O> = {readonly [K in keyof O]+?: MatchSchemaOf<O[K]>};

const test = {a: [1, 2, [{match: `any`, value: [3, 4]}]]} as const satisfies MatchSchema;
const test4 = {a: {match: `array`, value: {length: 3, fill: {match: `any`, value: [1, 3]}}}} as const satisfies MatchSchema;
const test5 = {a: {match: `array`, value: {length: 3, fill: {match: `any`, value: [1]}}}} as const satisfies MatchSchemaOf<typeof test4>;

const test3 = {a: [1, 1, 1]} as const satisfies MatchSchema;
const test2 = {a: {match: `array`, value: {length: 3, fill: {match: `single`, value: 1}}}} as const satisfies MatchSchemaOf<typeof test3>;


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

type D<T> = T extends readonly [] | readonly [infer Head, ...infer Tail] ? {[K in Partial<T>[`length`]]?: Partial<T[K]>} & {length?: T[`length`]} : false;

type ER = D<[1, 2]>

type What = MatchesExtending<2 | 1 | 3>;
*/
