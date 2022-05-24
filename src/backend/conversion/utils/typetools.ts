import {Function as Func} from "ts-toolbelt";

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

// using ts-toolbelt's List.UnionOf<> was giving some bad "type instantiation is excessively deep and
// possibly infinite" errors
// this works instead and is hopefully simpler (probably don't need whatever complex failsafes List.UnionOf<> has...)
export type UnionOf<L extends unknown[]> = L extends [infer Head, ...infer Tail] ? Head | UnionOf<Tail> : never;

export type ValuesOf<O> = O[keyof O];

export function narrow<T>(o: Func.Narrow<T>): T {
  return o as T;
}
