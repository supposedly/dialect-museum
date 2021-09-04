import depType from './type';

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
  return [...s.matchAll(/(\w+)(?:\s*:\s*[^,})]+)?/g)].map(match => depType[match[1]]);
}
