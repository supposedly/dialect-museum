import {DepType} from './type';

function isLiteral(obj) {
  return !!obj && obj.constructor === Object;
}

function isEmpty(obj) {
  if (!isLiteral(obj)) {
    return null;
  }
  for (const _ in obj) {
    return false;
  }
  return true;
}

function deepCopy(obj) {
  if (!isLiteral(obj)) {
    return obj;
  }
  const copy = {};
  for (const key in obj) {
    if (isLiteral(obj[key])) {
      copy[key] = deepCopy(obj[key]);
    } else {
      copy[key] = obj[key];
    }
  }
  return copy;
}

function mergeObjects(a, b) {
  const merged = {};
  for (const key in b) {
    if (isLiteral(a[key]) && isLiteral(b[key])) {
      merged[key] = mergeObjects(a[key], b[key]);
    } else {
      merged[key] = deepCopy(b[key]);
    }
  }
  for (const key in a) {
    // if key already encountered in b, ignore it here
    // (aka always favor later objects)
    if (Object.hasOwnProperty.call(merged, key)) {
      continue;
    }
    merged[key] = a[key];
  }
  return merged;
}

function trimAndUpdate(obj, mold) {
  if (isEmpty(mold)) {
    return deepCopy(obj);
  }
  const molded = {};
  for (const key in mold) {
    if (isLiteral(obj[key]) && isLiteral(mold[key])) {
      molded[key] = trimAndUpdate(obj[key], mold[key]);
    } else if (isEmpty(mold[key])) {
      molded[key] = deepCopy(obj[key]);
    } else {
      molded[key] = mold[key];
    }
  }
  return molded;
}

export function moldObject(obj, ...molds) {
  // TODO: there's probably a way to collapse this into just one function call
  return trimAndUpdate(obj, molds.reduce((acc, cur) => mergeObjects(acc, cur), {}));
}

export function qualifyKeys(obj, transform = o => o) {
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

export function extractDeps(arrowFunc) {
  if (!arrowFunc) {
    return null;
  }
  let [s] = String(arrowFunc).split(`=>`, 1);
  if (s.includes(`[`) || s.indexOf(`{`) !== s.lastIndexOf(`{`)) {
    // this means there's some destructuring and we can't just split on commas
    // so let's replace s with a string that has no destructuring
    const starts = [0];
    const ends = [];

    let i = 0;
    for (let c = s[i]; i < s.length; c = s[++i]) {
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
  return [...s.matchAll(/(\w+)(?:\s*:\s*[^,})]+)?/g)].map(match => DepType[match[1]]);
}
