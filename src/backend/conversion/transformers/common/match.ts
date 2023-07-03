/* eslint-disable max-classes-per-file */
import {type Narrow as $} from "../../utils/typetools";

type AllKeys<T> = T extends unknown ? keyof T : never;
type Id<T> = T extends infer U ? {[K in keyof U]: U[K]} : never;
type _ExclusifyUnion<T, K extends PropertyKey> =
    T extends unknown ? Id<T & Partial<Record<Exclude<K, keyof T>, never>>> : never;
export type ExclusifyUnion<T> = _ExclusifyUnion<T, AllKeys<T>>;  // TODO: take this out of this file

type MatcherFunc = (arg: any) => boolean;
export type Matcher<T> = Exclude<T, Function> | MatcherFunc;

export type DeepMatchShield<T> = {deepMatchShield: true, value: T};
export type DeepPartialNotMatch<T> =
    T extends Match<infer O> ? Match<DeepPartialNotMatch<O>>
  : T extends object ? {[K in keyof T]?: DeepPartialNotMatch<T[K]>}
  : T;
export type MatchOr<T> = T extends object ? ExclusifyUnion<T | Match<T>> : (T | Match<T>);
export type DeepMatchOr<O> = Match<DeepPartialNotMatch<O>> | DeepPartialNotMatch<O> | {
  [K in keyof O]?:
    O[K] extends Record<keyof any, unknown>
      ? DeepMatchOr<O[K]>
      : Match<O[K]> | O[K]
};

export abstract class Match<T> {
  public abstract original: T | T[];

  // eslint-disable-next-line class-methods-use-this
  matches(_other: any) {
    return false;
  }
}

function verifyLiteral(o: any): o is Record<string, any> {
  return o && Object.getPrototypeOf(o) === Object.prototype;
}

export class MatchOne<T> extends Match<T> {
  public original: T;
  private matcher: MatcherFunc;

  constructor(obj: T) {
    super();
    this.original = obj;

    if (obj instanceof Match) {
      // this was a nasty bug... TODO: see if can make do without the .bind()
      this.matcher = obj.matches.bind(obj);
    } else if (Array.isArray(obj)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      this.matcher = new All(...obj).matches;
    } else if (obj instanceof Function) {
      this.matcher = (arg: any) => obj(arg);
    } else if (verifyLiteral(obj)) {
      const individualMatches = Object.entries(obj).map(([k, v]) => [k, new MatchOne(v)] as const);
      this.matcher = other => individualMatches.every(
        ([k, matcher]: readonly [string, MatchOne<unknown>]) => matcher.matches(other[k]),
      );
    } else {
      this.matcher = other => obj === other;
    }
  }

  matches(other: any) {
    return this.matcher(other);
  }
}

class Not<T> extends MatchOne<T> {
  matches(other: any) {
    return !super.matches(other);
  }
}

class MatchMultiple<U> extends Match<U> {
  public original: U[];
  protected objs: MatchOne<U>[];

  constructor(...objs: U[]) {
    super();
    this.original = objs;
    this.objs = objs.map(obj => new MatchOne(obj));
  }

  matches(other: any) {
    return this.objs.includes(other);
  }
}

class Any<U> extends MatchMultiple<U> {
  matches(other: any) {
    return this.objs.some(obj => obj.matches(other));
  }
}

class None<U> extends Any<U> {
  matches(other: any) {
    return !super.matches(other);
  }
}

class All<U> extends MatchMultiple<U> {
  matches(other: any) {
    return this.objs.every(obj => obj.matches(other));
  }
}

export default Object.assign(
  <T>(obj: T) => new MatchOne(obj),
  {
    not<T>(obj: T) { return new Not(obj); },
    // use the lowercase functions if you're passing them literals
    any<U>(...objs: U[]) { return new Any(...objs); },
    none<U>(...objs: U[]) { return new None(...objs); },
    all<U>(...objs: U[]) { return new All(...objs); },
    // use the uppercase functions if you're passing them values that are already narrowed (i think?)
    // alternative foolproof method: use the lowercase functions until it starts erroring because
    // of arguments of different types, at which point use the uppercase functions
    Any<M extends any[]>(...objs: $<M>) { return new Any<typeof objs[number]>(...objs as any); },
    None<M extends any[]>(...objs: $<M>) { return new None<typeof objs[number]>(...objs as any); },
    All<M extends any[]>(...objs: $<M>) { return new All<typeof objs[number]>(...objs as any); },
  },
);

export function normalizeMatch(o: any) {
  return o instanceof Match ? o : new MatchOne(o);
}
export type {MatchMultiple};
export type MatchNot<T> = Not<T>;
export type MatchAny<U> = Any<U>;
export type MatchNone<U> = None<U>;
export type MatchAll<U> = All<U>;
