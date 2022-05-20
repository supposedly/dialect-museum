import {Any, List, Union, Object as Obj, T} from 'ts-toolbelt';

export enum DepType {
  /* constant dependencies */
  word,
  type,
  /* reactive dependencies */
  prev,
  next,
  prevConsonant,
  nextConsonant,
  prevVowel,
  nextVowel,
}

export enum TransformType {
  transformation,
  expansion,
  promotion,
}

export type UnknownList = List.List<unknown>;  // using `unknown[]` creates conflict sometimes when `readonly unknown[]` is expected or something?
export type OrderedObj<K = Any.Key, V = unknown> = List.List<[K, V]>;

export type EveryOtherOf<L extends UnknownList, Parity extends 'odd' | 'even' = 'even'>
  = 'odd' extends Parity ? EveryOtherOf<List.Tail<L>>
  : List.Length<L> extends 0 ? L
  : List.Prepend<EveryOtherOf<List.Drop<L, 2>>, List.Head<L>>;

// export type RevTail<L extends UnknownList> = List.Reverse<List.Tail<List.Reverse<L>>>;  // List.Drop<L, 1, '<-'>> is bugged and behaves like List.Head<L>
export type RevTail<L extends UnknownList> = L extends [...infer Head, infer _] ? Head : [];

/* export type KeysOf<A extends OrderedObj> = L.Length<L.Select<EveryOtherOf<L.UnNest<A>>, A.Key>> extends L.Length<EveryOtherOf<L.UnNest<A>>> ? L.Select<EveryOtherOf<L.UnNest<A>>, A.Key> : never; */
// ^ i actually DON'T have to manually verify that it's all Keys like that because the OrderedObj thing already eliminates non-Keys (even if TS doesn't know it)

// TODO: figure out why I can't replace this and ValuesOf<> with the Obj.ListOf<> versions below...
export type KeysOf<L extends OrderedObj> = List.Select<EveryOtherOf<List.UnNest<L>, 'even'>, Any.Key>;
export type ValuesOf<L extends OrderedObj> = EveryOtherOf<List.UnNest<L>, 'odd'>;
export type ObjectOf<L extends OrderedObj> = List.ZipObj<KeysOf<L>, ValuesOf<L>>;
export type ShiftOne<L extends OrderedObj> = List.Zip<
  RevTail<KeysOf<L>>,
  List.Tail<ValuesOf<L>>
  >;
export type ShiftedObjOf<L extends OrderedObj> = List.ZipObj<
  RevTail<KeysOf<L>>,
  List.Tail<ValuesOf<L>>
>;
export type IndicesOf<L extends OrderedObj> = Obj.ListOf<{[K in keyof L]: K}>;
export type KeysAndIndicesOf<L extends OrderedObj> = List.Zip<KeysOf<L>, IndicesOf<L>>;
/*
export type KeysOf<L extends OrderedObj> = Obj.ListOf<{[K in keyof L]: L[K][0]}>;
export type ValuesOf<L extends OrderedObj> = Obj.ListOf<{[K in keyof L]: L[K][0]}>;
export type ObjectOf<L extends OrderedObj> = List.ZipObj<KeysOf<L>, ValuesOf<L>>;
export type ShiftOne<L extends OrderedObj> = List.Zip<
  RevTail<KeysOf<L>>,
  List.Tail<ValuesOf<L>>
>;
*/
export type MergeObjs<L extends List.List<Record<string, any>>> = Obj.MergeAll<List.Head<L>, List.Tail<L>>;

type OrderedObjOfWithDupes<L extends List.List<Record<string, any>>, T extends 'keys' | 'values' | 'entries' = 'entries'> = Obj.ListOf<{
  [K in Extract<keyof L, `${number}`>]:
    // ensure each record is only 1 item long
    1 extends List.Length<Union.ListOf<keyof L[K]>>
      // clean code B)
      ? 'keys' extends T ? keyof L[K] : 'values' extends T ? L[K][keyof L[K]] : 'entries' extends T ? [keyof L[K], L[K][keyof L[K]]] : never
      : never
}>;

export type OrderedObjOf<L extends List.List<Record<string, any>>, T extends 'keys' | 'values' | 'entries' = 'entries'> =
  // ensure there are no duplicates (and anything else this could do is eclipsed by the "1 item long" check above!)
  List.Length<Union.ListOf<keyof MergeObjs<L>>> extends List.Length<L>
    ? OrderedObjOfWithDupes<L, T>
    : never;
