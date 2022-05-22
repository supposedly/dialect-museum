/* eslint-disable max-classes-per-file */
import {Function as Func} from "ts-toolbelt";

type AllKeys<T> = T extends unknown ? keyof T : never;
type Id<T> = T extends infer U ? {[K in keyof U]: U[K]} : never;
type _ExclusifyUnion<T, K extends PropertyKey> =
    T extends unknown ? Id<T & Partial<Record<Exclude<K, keyof T>, never>>> : never;
export type ExclusifyUnion<T> = _ExclusifyUnion<T, AllKeys<T>>;  // TODO: take this out of this file

type MatcherFunc = (obj: any) => boolean;
type Matcher<T> = Exclude<T, Function> | MatcherFunc;

type $<T> = Func.Narrow<T>;

export type MatchOr<T> = T extends object ? ExclusifyUnion<T | Match<T>> : (T | Match<T>);
export type DeepMatchOr<O> = Match<DeepMatchOr<O>> | {
  [K in keyof O]?:
    O[K] extends Record<keyof any, unknown>
      ? DeepMatchOr<O[K]>
      : Match<O[K]> | O[K]
};

export class Match<T> {
  private _justForStructuralTypecheck: T = undefined as any;

  // eslint-disable-next-line class-methods-use-this
  matches(_other: any) {
    return false;
  }
}

function verifyLiteral(o: any): o is Record<string, any> {
  return Object.getPrototypeOf(o) === Object.prototype;
}

export class MatchOne<T> extends Match<T> {
  private matcher: MatcherFunc;

  constructor(obj: Matcher<T>) {
    super();

    if (obj instanceof Match) {
      // this was a nasty bug... TODO: see if can make do without the .bind()
      this.matcher = obj.matches.bind(obj);
    } else if (Array.isArray(obj)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      this.matcher = new All(...obj).matches;
    } else if (obj instanceof Function) {
      this.matcher = obj;
    } else if (verifyLiteral(obj)) {
      const individualMatches = Object.entries(obj).map(([k, v]) => [k, new MatchOne(v)] as const);
      this.matcher = other => individualMatches.every(
        <M>([k, matcher]: readonly [string, MatchOne<M>]) => matcher.matches(other[k]),
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
  protected objs: MatchOne<U>[];

  constructor(...objs: Matcher<U>[]) {
    super();
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
  <T>(obj: Matcher<T>) => new MatchOne(obj),
  {
    not<T>(obj: Matcher<T>) { return new Not(obj); },
    // use the lowercase functions if you're passing them literals
    any<U>(...objs: Matcher<U>[]) { return new Any(...objs); },
    none<U>(...objs: Matcher<U>[]) { return new None(...objs); },
    all<U>(...objs: Matcher<U>[]) { return new All(...objs); },
    // use the uppercase functions if you're passing them values that are already narrowed (i think?)
    // alternative foolproof method: use the lowercase functions until it starts erroring because
    // of arguments of different types, at which point use the uppercase functions
    Any<M extends any[]>(...objs: $<M>) { return new Any<typeof objs[number]>(...objs as any); },
    None<M extends any[]>(...objs: $<M>) { return new None<typeof objs[number]>(...objs as any); },
    All<M extends any[]>(...objs: $<M>) { return new All<typeof objs[number]>(...objs as any); },
  },
);

export type {MatchMultiple};
export type MatchNot<T> = Not<T>;
export type MatchAny<U> = Any<U>;
export type MatchNone<U> = None<U>;
export type MatchAll<U> = All<U>;
