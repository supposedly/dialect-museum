/* eslint-disable max-classes-per-file */

type Matcher<T> = Exclude<T, Function> | ((obj: any) => boolean);

export class Match {
  // eslint-disable-next-line class-methods-use-this
  matches(_other: any) {
    return false;
  }
}

function verifyLiteral(o: any): o is Record<string, any> {
  return Object.getPrototypeOf(o) === Object.prototype;
}

class MatchOne<T> extends Match {
  private matcher: (obj: any) => boolean;

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
        <M extends Match>([k, matcher]: readonly [string, M]) => matcher.matches(other[k]),
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

class MatchMultiple<T> extends Match {
  protected objs: MatchOne<T>[];

  constructor(...objs: Matcher<T>[]) {
    super();
    this.objs = objs.map(obj => new MatchOne(obj));
  }

  matches(other: any) {
    return this.objs.includes(other);
  }
}

class Any<T> extends MatchMultiple<T> {
  matches(other: any) {
    return this.objs.some(obj => obj.matches(other));
  }
}

class None<T> extends Any<T> {
  matches(other: any) {
    return !super.matches(other);
  }
}

class All<T> extends MatchMultiple<T> {
  matches(other: any) {
    return this.objs.every(obj => obj.matches(other));
  }
}

export default Object.assign(
  <T>(obj: Matcher<T>) => new MatchOne(obj),
  {
    not<T>(obj: Matcher<T>) { return new Not(obj); },
    any<T>(...objs: Matcher<T>[]) { return new Any(...objs); },
    none<T>(...objs: Matcher<T>[]) { return new None(...objs); },
    all<T>(...objs: Matcher<T>[]) { return new All(...objs); },
  },
);
