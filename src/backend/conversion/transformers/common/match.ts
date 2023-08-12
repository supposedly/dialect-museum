/* eslint-disable max-classes-per-file */
import type { M } from "ts-toolbelt";
import {type Narrow as Narrow, type ValuesOf} from "../../utils/typetools";

type AllKeys<T> = T extends unknown ? keyof T : never;
type Id<T> = T extends infer U ? {[K in keyof U]: U[K]} : never;
type _ExclusifyUnion<T, K extends PropertyKey> =
    T extends unknown ? Id<T & Partial<Record<Exclude<K, keyof T>, never>>> : never;
export type ExclusifyUnion<T> = _ExclusifyUnion<T, AllKeys<T>>;  // TODO: take this out of this file

type MatcherFunc = (arg: any) => boolean;
export type Matcher<T> = Exclude<T, Function> | MatcherFunc;

export type DeepMatchShield<T> = {deepMatchShield: true, value: T};
export type DeepPartialNotMatch<T> =
    T extends Match<infer M, infer O> ? Match<M, DeepPartialNotMatch<O>>
  : T extends object ? {[K in keyof T]?: DeepPartialNotMatch<T[K]>}
  : T;
export type MatchOr<T> = T extends object ? ExclusifyUnion<T | Match<any, T>> : (T | Match<any, T>);
export type DeepMatchOr<O> = Match<any, DeepPartialNotMatch<O>> | DeepPartialNotMatch<O> | {
  [K in keyof O]?:
    O[K] extends Record<keyof any, unknown>
      ? DeepMatchOr<O[K]>
      : MatchOne<O[K]> | O[K]
};

function verifyLiteral(o: any): o is Record<string, any> {
  return o && Object.getPrototypeOf(o) === Object.prototype;
}

export const matcher = {
  one<Self extends unknown>(self: Self, other: unknown): boolean {
    if (this.literal(
      {
        match: match.any(Object.keys(this) as Array<keyof typeof matcher>),
        value: match.guard(`any`)
      },
      self
    )) {
      return (this[self.match] as any)(self.value, other);
    }
    return this.literal(self as any, other);
  },
  guard<Self extends keyof SillyMapping>(self: Self, other: unknown): other is SillyMapping[Self] {
    return typeof other === self;
  },
  literal<Self extends object>(self: Self, other: unknown): other is MatchAsType<Self> {
    if (self instanceof Function) {
      return !!self(other);
    }
    if (Array.isArray(self)) {
      if (!Array.isArray(other)) {
        return false;
      }
      return self.every((v, idx) => this.one(v, other[idx]))
    }
    if (verifyLiteral(self)) {
      return Object.entries(self).every(([k, v]) => {
        if (k in self) {
          return this.one(v, other?.[k as keyof typeof other])
        }
        return false;
      });
    }
    return false;
  },
  array<Self extends {
    length:
      // TODO: Fix MatchOr<> so you can use that for these
      // (i assume this means MatchOr<> and derivatives are completely borked wherever i use them for now rip)
      | number | MatchGuard<`number`>
      | MatchAny<(number | MatchGuard<`number`>)[]>
      | MatchNone<(number | MatchGuard<`number`>)[], unknown>,
    fill: unknown}
  >({length, fill}: Self, other: unknown) {
    return Array.isArray(other) && this.one({length}, other) && other.every(v => this.one(fill, v));
  },
  not<Self extends unknown[]>(self: Self, other: unknown) {
    return !this.one(self, other);
  },
  any<Self extends unknown[]>(self: Self, other: unknown) {
    return self.some(v => this.one(v, other));
  },
  all<Self extends unknown[]>(self: Self, other: unknown) {
    return self.every(v => this.one(v, other));
  },
  none<Self extends unknown[]>(self: Self, other: unknown) {
    return !this.any(self, other);
  }
};

const match = Object.fromEntries(
  Object.keys(matcher).map(
    k => [k, <T>(arg: Narrow<T>, source: unknown) => ({match: k, value: arg, source})]
  )
) as {[K in keyof typeof matcher]: <
  T extends (typeof matcher[K] extends (arg: infer F, other: unknown) => boolean ? F : unknown),
  Source extends unknown
>(arg: Narrow<T>, source?: Narrow<Source>) => {match: K, value: T, source: Source}};
export default match;

const bruh = (arg: unknown) => typeof arg;

export type Match<M extends keyof typeof matcher, T> = {
  match: M,
  value: T
}
type MatchMultiple<M extends keyof typeof matcher, Arr extends unknown[]> = Match<M, Arr>;
export type MatchOne<T> = Match<`one`, T>;
export type MatchGuard<T extends ReturnType<typeof bruh> | `any`> = Match<`guard`, T>;
export type MatchAny<Arr extends unknown[]> = MatchMultiple<`any`, Arr>;
export type MatchAll<Arr extends unknown[]> = MatchMultiple<`all`, Arr>;
export type MatchNot<T extends Source, Source> = Match<`not`, T> & {
  source: Source
};
export type MatchNone<Arr extends Source[], Source> = MatchMultiple<`none`, Arr> & {
  source: Source
};

type SillyMapping = {
  string: string
  number: number
  bigint: bigint
  boolean: boolean
  symbol: symbol
  undefined: undefined
  object: object
  function: Function
  any: any
};
// TODO: figure out how to write the recursion cleanly lol
export type MatchAsType<M> =
  M extends MatchOne<infer T> ? MatchAsType<T extends (arg: any) => arg is infer X ? X : T>
  : M extends MatchNot<infer T, infer Source> ? Exclude<Source, MatchAsType<T>>
  : M extends MatchGuard<infer T> ? SillyMapping[T]
  : M extends MatchAny<infer Arr> ? MatchAsType<Arr[number]>
  : M extends MatchNone<infer Arr, infer Source> ? Exclude<Source, MatchAsType<Arr[number]>>
  : M extends Record<string, any> ? {[K in keyof M]: MatchAsType<M[K]>}
  : M;
