/* eslint-disable max-classes-per-file */

class Not {
  constructor(value) {
    this.value = value;
  }

  matches(other) {
    // eslint-disable-next-line no-use-before-define
    if (this.value instanceof Or || this.value instanceof Not) {
      return this.value.matches(other);
    }
    return this.value !== other;
  }
}

class Or {
  constructor(...values) {
    this.values = values;
  }

  matches(other) {
    return this.values.some(value => {
      if (value instanceof Not || value instanceof Or) {
        return value.matches(other);
      }
      return value === other;
    });
  }
}

class Props {
  constructor(...objs) {
    if (objs === undefined || objs === null) {
      objs = [];
    }
    this.objs = objs.map(obj => {
      const objCopy = {...obj};
      Object.entries(objCopy).forEach(([k, v]) => {
        if (
          !(v instanceof Props || v instanceof Not || v instanceof Or)
          && v instanceof Object
          && !Array.isArray(v)
        ) {
          objCopy[k] = new Props(v);
        }
      });
      return objCopy;
    });
    this.empty = this.objs.length === 0;
  }

  matches(other) {
    if (this.empty) {
      return true;
    }
    return this.objs.some(
      obj => Object.entries(obj).every(([k, v]) => {
        if (Object.prototype.hasOwnProperty.call(other, k)) {
          if (v instanceof Props || v instanceof Not || v instanceof Or) {
            return v.matches(other[k]);
          }
          return v === other[k];
        }
        return false;
      })
    );
  }

  or(other) {
    return new Props(...this.objs, ...other.objs);
  }
}

module.exports = {
  Props,
  Not,
  Or,
};
