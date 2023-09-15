// https://stackoverflow.com/questions/63542526/merge-discriminated-union-of-object-types-in-typescript
// I can't use ts-toolbelt's MergeUnion<> because for some reason it randomly produces `unknowns` under
// some compilers and not others...
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export type MergeUnion<U> = UnionToIntersection<U> extends infer O ? {[K in keyof O]: O[K]} : never;

// https://stackoverflow.com/a/59687759
export type IsUnion<T, U extends T = T> = T extends unknown ? [U] extends [T] ? false : true : false;

export type UnionOf<L extends readonly unknown[]> = L[number];

export type ValuesOf<O> = O[keyof O];
export type ArrayOr<T> = T | T[];
