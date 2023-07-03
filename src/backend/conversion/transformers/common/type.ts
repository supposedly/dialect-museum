import {Any, List, Union, Object as Obj} from 'ts-toolbelt';
import {type MergeUnion, type UnionOf, type Zip, type ZipObj} from '../../utils/typetools';

export type UnknownList = List.List<unknown>;  // using `unknown[]` fails when `readonly unknown[]` is expected(?)
export type OrderedObj<K = Any.Key, V = unknown> = List.List<[K, V]>;

export type DropLast<L extends UnknownList> = L extends readonly [...infer Head, infer _] ? Head : [];
export type DropNone<L extends UnknownList> = DropLast<L>;
export type LastOf<L extends UnknownList> = L extends readonly [...infer _, infer Tail] ? Tail : [];

export type KeysOf<L extends OrderedObj> = L extends OrderedObj<infer K extends Any.Key, infer V>
  ? {[I in keyof L]: L[I] extends [K, V] ? L[I][0] : L[I]}
  : never;
export type ValuesOf<L extends OrderedObj> = L extends OrderedObj<infer K extends Any.Key, infer V>
  ? {[I in keyof L]: L[I] extends [K, V] ? L[I][1] : L[I]}
  : never;
export type ObjectOf<L extends OrderedObj> = ZipObj<KeysOf<L>, ValuesOf<L>>;
export type ShiftOne<L extends OrderedObj> = Zip<
  DropLast<KeysOf<L>>,
  List.Tail<ValuesOf<L>>
>;
export type ShiftedObjOf<L extends OrderedObj> = List.ZipObj<
  DropLast<KeysOf<L>>,
  List.Tail<ValuesOf<L>>
>;
export type IndicesOf<L extends OrderedObj> = {[K in keyof L]: K};
export type KeysAndIndicesOf<L extends OrderedObj> = Zip<KeysOf<L>, IndicesOf<L>>;

export type MergeObjs<L extends List.List<Record<string, any>>> = MergeUnion<UnionOf<L>>;

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
