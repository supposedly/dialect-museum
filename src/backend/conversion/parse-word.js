import * as utils from './utils';
const {
  misc: { lastOf }, syllables: { newSyllable, getSyllableWeight, setStressedSyllable, copy },
} = utils;
import { alphabet as abc } from './symbols';
import { obj } from './objects';

function interpolateAndParse(strings, rootConsonants) {
  const alreadyStressed = strings[0].startsWith(`+`) || strings[0].startsWith(`-`);
  const syllables = [newSyllable()];
  strings.forEach(s => {
    let lastSyllable = lastOf(syllables);
    // iterate thru syllable chunks
    s.split(` `).forEach((chunk, i) => {
      if (i > 0) {
        // means this chunk adds a new syllable
        lastSyllable = newSyllable();
        syllables.push(lastSyllable);
      }
      // +/- at the start of a chunk marks whether it's stressed
      // (again by convention i'm probably gonna do all-or-nothing,
      // ie either stress is automatic or EVERY syllable is marked)
      if (chunk.startsWith(`-`) || chunk.startsWith(`+`)) {
        if (!alreadyStressed) {
          // ...and if i forget that convention...
          throw new Error(
            `Inconsistent use of +- for stress in parseWord string: unexpected use`,
          );
        }
        lastSyllable.meta.stressed = chunk.startsWith(`+`);
        chunk = chunk.slice(1);
      } else if (alreadyStressed && i > 0) {
        // ...ditto...
        throw new Error(
          `Inconsistent use of +- for stress in parseWord string: unexpected disuse`,
        );
      }
      lastSyllable.value.push(
        ...chunk.split(`.`)  // m.u.s._.t > [m, u, s, _, t, ...]
          .filter(c => abc[c])  // to avoid undefined later
          .map(c => obj.process.bind(obj)(abc[c])),  // -> corresponding objects
      );
    });
    if (rootConsonants.length) {
      lastSyllable.value.push(rootConsonants.shift());
    }
  });
  return syllables;
}

function setWeights(syllables) {
  syllables.forEach(s => { s.meta.weight = getSyllableWeight(s); });
}

// mark all not-stressed syllables as unstressed
// (aka normalize "either false or null" to "only false")
// (either as a continuation of the above,
// or as a cover for if i forget my convention and
// only mark a + syllable without marking any -)
function setBooleanStress(syllables) {
  syllables.forEach(s => {
    s.meta.stressed = !!s.meta.stressed;
    // if (s.meta.stressed !== true) {
    //   s.meta.stressed = false;
    // }
  });
}

// add schwa to CVCC syllables
function addSchwa(syllables) {
  syllables.forEach(s => {
    if (
      s.meta.weight === 3
      && s.value.length === 4
      && lastOf(s.value).value !== lastOf(s.value, 1).value
    ) {
      s.value.push(abc.Schwa, s.value.pop());
    }
  });
}

// split a template string written using the keys of ./symbols.js's alphabet object
// into syllable objects + consonant objects, incl. analyzing stress
// string format: parseWord`c.v c.v.c c.v` or parseWord`-c.v +c.v.c -c.v`, aka
// 1. syllables are separated manually (not worth it to do algorithmically lol) with
//    spaces, and individual orthographic segments are separated with periods
// 2. syllables can be optionally prefixed (preferably all at once) with - or +
//    to indicate stress, esp. useful when stress in a given word isn't automatic
// can optionally be called as parseWord({ extraStuff: etc })`...` to pass variables
// (just suffixes for now) that aren't root consonants & this can't be interpolated
// in particular: parseWord({ suffix: [{ suffix object }] })`...`
// `preTransform` and `postTransform` are arrays of arrays of transform functions
// & each inner array will cause the parse result to diverge, because its functions
// will be applied to a new copy of the result
// `preTransform` functions will run immediately after parsing and before stress-
// assignment and weight-assignment and everything,
// while `postTransform` functions will run after all of that and immediately before
// the function returns
// return value: an array of all transformed parse results; if there were no transformers,
// or if there was at most one subarray of preTransform and postTransform functions each,
// returns a single-element array of the sole parse result
function parseWordFunc({
  preTransform = [[]],
  postTransform = [[]],
  meta = {},
} = {}) {
  return (strings, ...rootConsonants) => {
    // by convention i'm gonna do all-or-nothing
    // ie either stress is automatic or EVERY syllable is marked for it
    // ...so i can use the very first char of the first string chunk to
    // determine whether or not the whole string is marked for stress
    const alreadyStressed = strings[0].startsWith(`-`) || strings[0].startsWith(`+`);

    const initialResult = interpolateAndParse(strings, rootConsonants);

    const preTransformed = preTransform.map(transforms => {
      // XXX: can potentially try to cache this result (...somehow) for
      // even-better perf than copying every time, but may not be possible
      // the problem is that, when i tried doing something like that
      // by passing only one single result around,
      // the resulting necessity of avoiding mutation in EVERY
      // interaction with the syllables array made the code rly rly rly
      // landminey and easy to mess up and frustrating to write
      const syllables = copy(initialResult);
      // stuff like `false`, `null`, etc. is allowed and will just be skipped
      transforms.forEach(f => f && f(syllables));
      return syllables;
    });

    preTransformed.forEach(setWeights);

    if (!alreadyStressed) {
      preTransformed.forEach(setStressedSyllable);
    }

    preTransformed.forEach(setBooleanStress);

    preTransformed.forEach(addSchwa);

    const postTransformed = preTransformed.map(
      transformedSyllables => postTransform.map(
        transforms => {
          const newCopy = copy(transformedSyllables);
          const localMeta = {...meta};
          // stuff like `false`, `null`, etc. is allowed and will just be skipped
          transforms.forEach(f => f && f(newCopy, localMeta));
          return {result: newCopy, localMeta};
        },
      ),
    ).flat();

    return postTransformed.map(({result, localMeta}) => obj.obj(`word`, localMeta, result));
  };
}

function createWordParserTag(postprocess = null) {
  return (first, ...rest) => {
    if (Array.isArray(first)) {
      // this means the caller just wants the template tag
      const ret = parseWordFunc()(first, ...rest);
      return postprocess ? postprocess(ret) : ret;
    }
    // this means the caller wants to pass config params to the tag
    const ret = parseWordFunc(first);
    return postprocess ? (...args) => postprocess(ret(...args)) : ret;
  };
}

export const parseWord = createWordParserTag();
export const parseSyllable = createWordParserTag(([word]) => {
  word.value[0].meta.stressed = null;
  return word.value[0];
});
export const parseString = createWordParserTag(([word]) => word.value.map(s => s.value).flat());
export const parseLetter = createWordParserTag(([word]) => word.value[0].value[0]);
