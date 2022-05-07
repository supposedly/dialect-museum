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

export type Alphabet<T extends Record<string, any>> = Union.Merge<T[keyof T]>;
export type AnyAlphabet = Record<string, Base>;

export function newAlphabet<A, T extends ProtoAlphabet<A>>(_type: A, o: $<T>): Alphabet<$<T>> {
  // return o as unknown as ReturnType<typeof newAlphabet<T>>;
  return o as unknown as Alphabet<$<T>>;
}
