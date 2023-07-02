function isLiteral(obj: any) {
  return !!obj && obj.constructor === Object;
}

function isEmpty(obj: any): boolean | null {
  if (!isLiteral(obj)) {
    return null;
  }
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const _ in obj) {
    return false;
  }
  return true;
}

function deepCopy(obj: any) {
  if (!isLiteral(obj)) {
    return obj;
  }
  const copy: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    if (isLiteral(obj[key])) {
      copy[key] = deepCopy(obj[key]);
    } else {
      copy[key] = obj[key];
    }
  });
  return copy;
}

export function mergeObjects(a: any, b: any) {
  const merged: Record<string, any> = {};

  Object.keys(b).forEach(key => {
    if (isLiteral(a[key]) && isLiteral(b[key])) {
      merged[key] = mergeObjects(a[key], b[key]);
    } else {
      merged[key] = deepCopy(b[key]);
    }
  });

  Object.keys(a)
    .filter(key => !Object.hasOwnProperty.call(merged, key))
    .forEach(key => { merged[key] = a[key]; });

  return merged;
}

function trimAndUpdate(obj: any, mold: any) {
  if (isEmpty(mold)) {
    return deepCopy(obj);
  }
  const molded: Record<string, any> = {};
  Object.keys(mold).forEach(key => {
    if (isLiteral(obj[key]) && isLiteral(mold[key])) {
      molded[key] = trimAndUpdate(obj[key], mold[key]);
    } else if (isEmpty(mold[key])) {
      molded[key] = deepCopy(obj[key]);
    } else {
      molded[key] = mold[key];
    }
  });
  return molded;
}

export function moldObject(obj: any, ...molds: any) {
  // TODO: there's probably a way to collapse this into just one function call
  return trimAndUpdate(obj, molds.reduce((acc: any, cur: any) => mergeObjects(acc, cur), {}));
}

export function qualifyKeys(obj: any, transform = (o: any) => o): any[] {
  if (!isLiteral(obj)) {
    return [];
  }
  return Object.keys(obj)
    .flatMap(parent => [
      [parent],
      ...qualifyKeys(obj[parent]).map(child => [parent, ...child]),
    ])
    .map(transform);
}

/* eslint-disable no-plusplus */
export function extractParams(arrowFunc: Function) {
  if (!arrowFunc) {
    return null;
  }
  let [s] = String(arrowFunc).split(`=>`, 1);
  if (s.includes(`[`) || s.indexOf(`{`) !== s.lastIndexOf(`{`)) {
    // this means there's some destructuring and we can't just split on commas
    // so let's replace s with a string that has no destructuring
    const starts = [0];
    const ends = [];

    for (let i = 0, c = s[i]; i < s.length; c = s[++i]) {
      if (c === `:`) {
        let braces = 0;
        let bracks = 0;

        let j = i + 1;
        for (let k = s[j]; k !== `,` || braces !== 0 || bracks !== 0; k = s[++j]) {
          switch (k) {
            case `[`:
              bracks++;
              break;
            case `]`:
              bracks--;
              break;
            case `{`:
              braces++;
              break;
            case `}`:
              braces--;
              break;
            default:
              break;
          }
        }

        ends.push(i);
        starts.push(j);

        i = j;
      }
    }
    ends.push(s.length);

    // ends.length === starts.length here (should, at least)
    const topLevelSubstrings = [];
    for (let i = 0; i < ends.length; i++) {
      topLevelSubstrings.push(s.slice(starts[i], ends[i]));
    }
    s = topLevelSubstrings.join(``);
  }
  return [...s.matchAll(/(\w+)(?:\s*:\s*[^,})]+)?/g)].map(match => match[1]);
}
/* eslint-enable no-plusplus */
