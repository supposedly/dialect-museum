/* eslint-disable max-classes-per-file */

export class Match {
  // eslint-disable-next-line class-methods-use-this
  matches(_other: any) {
    return false;
  }
}

class MatchOne extends Match {
  private matcher: (obj: Record<string, any>) => boolean;

  constructor(obj: any) {
    super();

    if (obj instanceof Match) {
      // this was a nasty bug... TODO: see if can make do without the .bind()
      this.matcher = obj.matches.bind(obj);
    } else if (Array.isArray(obj)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      this.matcher = new All(...obj).matches;
    } else if (obj instanceof Function) {
      this.matcher = obj;
    } else if (obj instanceof Object) {
      obj = Object.entries(obj).map(([k, v]) => [k, new MatchOne(v)]);
      this.matcher = other => obj.every(
        <T extends Match>([k, matcher]: [string, T]) => matcher.matches(other[k]),
      );
    } else {
      this.matcher = other => obj === other;
    }
  }

  matches(other: any) {
    return this.matcher(other);
  }
}

class Not extends MatchOne {
  matches(other: any) {
    return !super.matches(other);
  }
}

class MatchMultiple extends Match {
  protected objs: MatchOne[];

  constructor(...objs: any[]) {
    super();
    this.objs = objs.map(obj => new MatchOne(obj));
  }

  matches(other: any) {
    return this.objs.includes(other);
  }
}

class Any extends MatchMultiple {
  matches(other: any) {
    return this.objs.some(obj => obj.matches(other));
  }
}

class None extends Any {
  matches(other: any) {
    return !super.matches(other);
  }
}

class All extends MatchMultiple {
  matches(other: any) {
    return this.objs.every(obj => obj.matches(other));
  }
}

export default Object.assign(
  (obj: any) => new MatchOne(obj),
  {
    not(obj: any) { return new Not(obj); },
    any(...objs: any[]) { return new Any(...objs); },
    none(...objs: any[]) { return new None(...objs); },
    all(...objs: any[]) { return new All(...objs); },
  },
);
