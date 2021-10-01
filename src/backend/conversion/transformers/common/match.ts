/* eslint-disable max-classes-per-file */

class Match {
  constructor(_obj) {}

  matches(_other) {
    return false;
  }
}

class MatchOne extends Match {
  constructor(obj) {
    super(obj);

    if (obj instanceof Match) {
      // this was a nasty bug... TODO: see if can make do without the .bind()
      this.matcher = obj.matches.bind(obj);
    } else if (Array.isArray(obj)) {
      this.matcher = new All(...obj).matches;
    } else if (obj instanceof Function) {
      this.matcher = obj;
    } else if (obj instanceof Object) {
      obj = Object.entries(obj).map(([k, v]) => [k, new MatchOne(v)]);
      this.matcher = other => obj.every(([k, matcher]) => matcher.matches(other[k]));
    } else {
      this.matcher = other => obj === other;
    }
  }

  matches(other) {
    return this.matcher(other);
  }
}

class Not extends MatchOne {
  constructor(...objs) {
    super(...objs);
  }

  matches(other) {
    return !super.matches(other);
  }
}

class MatchMultiple extends Match {
  constructor(...objs) {
    super(...objs);
    this.objs = objs.map(obj => new MatchOne(obj));
  }

  matches(other) {
    return this.objs.includes(other);
  }
}

class Any extends MatchMultiple {
  constructor(...objs) {
    super(...objs);
  }

  matches(other) {
    return this.objs.some(obj => obj.matches(other));
  }
}

class None extends Any {
  constructor(...objs) {
    super(...objs);
  }

  matches(other) {
    return !super.matches(other);
  }
}

class All extends MatchMultiple {
  constructor(...objs) {
    super(...objs);
  }

  matches(other) {
    return this.objs.every(obj => obj.matches(other));
  }
}

export default Object.assign(
  obj => new MatchOne(obj),
  {
    not(obj) { return new Not(obj); },
    any(...objs) { return new Any(...objs); },
    none(...objs) { return new None(...objs); },
    all(...objs) { return new All(...objs); },
  },
);
