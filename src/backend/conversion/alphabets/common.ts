/* all hope abandon ye who enter here */
// btw half of this file needs to be moved into underlying.ts because it's not actually "common"
// bc each alphabet needs to have its own concepts (eg no guarantee that a higher alphabet will
// have consonants, vowels, suffixes, whatevers)

import {Function as Func, Union} from "ts-toolbelt";

type $<T> = Func.Narrow<T>;

export const _ = {};

export interface Base<T extends string = string, V = unknown> {
  type: T
  value: V
}

export type ProtoAlphabet<T> = {
  [K in keyof T]: Record<string, T[K]>
};

export type Alphabet<T extends Record<string, any>, Types> = {abc: Union.Merge<T[keyof T]>, __types: Set<Types>};
export type AnyAlphabet = {abc: Record<string, Base>, __types: Set<string>};
export type ABC<A extends AnyAlphabet> = A[`abc`];
export type Types<A extends AnyAlphabet> = A[`__types`] extends Set<infer U> ? U extends string ? U : never : never;

export function newAlphabet<A, T extends ProtoAlphabet<A>>(type: A, o: $<T>): Alphabet<$<T>, keyof A> {
  return {
    __types: new Set(Object.keys(type)),
    abc: Object.fromEntries(Object.values(o).flatMap(group => Object.entries(group as any))),
  } as any;
}
