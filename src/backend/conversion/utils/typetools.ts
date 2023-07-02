import {Function as Func, Union} from "ts-toolbelt";
import {Key} from "ts-toolbelt/out/Any/Key";

export type Optional<T> = T | undefined;

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

const TypeErrorTag: unique symbol = Symbol(`TypeErrorTag`); // don't export it!

export type invalid<Message> = {
  [x in keyof Message | typeof TypeErrorTag]: x extends keyof Message
    ? Message[x & keyof Message]
    : {readonly [TypeErrorTag]: unique symbol}; // anonymous unique symbol
};

// XXX: Until error types land or I find a workaround, THESE ARE INCORRECT! `never` doesn't halt evaluation like I want
export type UniqueLength<T extends unknown[]> = T extends Array<infer U> ? Union.ListOf<U>[`length`] : never;
export type UniqueArray<T extends unknown[]> = T[`length`] extends UniqueLength<T> ? T : never;

// https://stackoverflow.com/questions/63542526/merge-discriminated-union-of-object-types-in-typescript
// I can't use ts-toolbelt's MergeUnion<> because for some reason it randomly produces `unknowns` under
// some compilers and not others...
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export type MergeUnion<U> = UnionToIntersection<U> extends infer O ? {[K in keyof O]: O[K]} : never;

// Same as MergeUnion<> but recursive
export type DeepMerge<O> = [O] extends [object] ? {
  // I think the MergeUnion<O> helps it not distribute or something? Not sure exactly what's
  // going on but it doesn't work without it if O is a union :(
  [K in keyof MergeUnion<O> & keyof O]: DeepMerge<O[K]>
  // Now with that settled it does work if you just do:
  //  [K in keyof MergeUnion<O>]: DeepMerge<MergeUnion<O>[K]>
  // but in the interest of not duplicating that MergeUnion<O>, you might want to try:
  //  * [K in keyof MergeUnion<O>]: DeepMerge<O[K]>
  // which SHOULD be the same -- but TypeScript ofc doesn't love it unless you go
  //  [K in keyof MergeUnion<O>]: K extends keyof O ? DeepMerge<O[K]> : never
  // so in the double-interest of not having that conditional, that `&` is my best solution
} : O;

export type UnionOf<L extends readonly unknown[]> = L[number];

// so I can use these to force TS to realize it's fine while I figure out what's even wrong
export type Force<T, B> = T extends B ? T : never;
export type ForceKey<T, K> = K extends keyof T ? T[K] : never;

// less weirdly-complicated than ts-toolbelt's List.Zip<>
export type Zip<L1 extends readonly unknown[], L2 extends readonly unknown[]> =
  [L1, L2] extends [readonly [infer A extends L1[0], ...infer Rest1], readonly [infer B extends L2[0], ...infer Rest2]]
    ? [[A, B], ...Zip<Rest1, Rest2>]
    : [];

type _ZipObj<Keys extends readonly Key[], Values extends readonly unknown[]> =
  [Keys, Values] extends [
    [infer KHead extends Keys[0], ...infer KTail extends readonly Key[]],
    [infer VHead extends Values[0], ...infer VTail],
  ]
    ? Record<KHead, VHead> | _ZipObj<KTail, VTail>
    : {};
export type ZipObj<
  Keys extends readonly Key[],
  Values extends readonly unknown[],
> = MergeUnion<_ZipObj<Keys, Values>>;

export type ValuesOf<O> = O[keyof O];
export type ArrayOr<T> = T | T[];

export type Narrow<T> = Func.Narrow<T>;

export function narrow<T>(o: Narrow<T>): T {
  return o as T;
}

export function narrowSet<E extends unknown[]>(values: Narrow<E>): Set<E[number]> {
  return new Set(values);
}
