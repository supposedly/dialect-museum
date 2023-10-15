// https://stackoverflow.com/questions/63542526/merge-discriminated-union-of-object-types-in-typescript
// I can't use ts-toolbelt's MergeUnion<> because for some reason it randomly produces `unknowns` under
// some compilers and not others...
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export type MergeUnion<U> = UnionToIntersection<U> extends infer O ? {[K in keyof O]: O[K]} : never;
export type Merge<A, B> = [B] extends [never] ? A : [A] extends [never] ? B : A extends object ? B extends object ? {
  [K in keyof A | keyof B]: 
    K extends keyof A & keyof B
    ? Merge<A[K], B[K]>
    : K extends keyof B
    ? B[K]
    : K extends keyof A
    ? A[K]
    : never;
} : A : B;
export type MergeArray<Arr extends ReadonlyArray<unknown>> =
  Arr extends readonly [infer Head] ? Head
  : Arr extends readonly [infer Head, ...infer Tail] ? Merge<Head, MergeArray<Tail>>
  : never;
// https://stackoverflow.com/a/59687759
export type IsUnion<T, U extends T = T> = T extends unknown ? [U] extends [T] ? false : true : false;

export type UnionOf<L extends readonly unknown[]> = L[number];

export type ValuesOf<O> = O[keyof O];
export type ArrayOr<T> = T | T[];

export type NestedArray<T> = ReadonlyArray<T | NestedArray<T>>;
export type NestedArrayOr<T> = T | ReadonlyArray<NestedArrayOr<T>>;

export type NestedRecord<T> = {[key: string]: T | NestedRecord<T>, [noArraysBruh: number]: never};
export type NestedRecordOr<T> = T | {[key: string]: NestedRecordOr<T>, [noArraysBruh: number]: never};
