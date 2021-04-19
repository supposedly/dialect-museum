const { alphabet: abc } = require(`../symbols`);
const obj = require(`../objects`);

const lastOf = (seq, index = 0) => seq[seq.length - 1 - index];

const newSyllable = (string = []) => obj.obj(
  `syllable`,
  { stressed: null, weight: null },
  string
);

function initialSyllables(prefix) {
  if (!prefix) {  // null or empty
    return [newSyllable()];
  }
  return [...prefix.syllables.map(newSyllable), newSyllable(prefix.rest)];
}

// split a template string written using the keys of ./symbols.js's alphabet object
// into syllable objects + consonant objects, incl. analyzing stress
// string format: wordify`c.v c.v.c c.v` or wordify`-c.v +c.v.c -c.v`, aka
// 1. syllables are separated manually (not worth it to do algorithmically lol) with
//    spaces, and individual orthographic segments are separated with periods
// 2. syllables can be optionally prefixed (preferably all at once) with - or +
//    to indicate stress, esp. useful when stress in a given word isn't automatic
// can optionally be called as wordify({ extraStuff: etc })`...` to pass variables
// (just suffixes for now) that aren't root consonants & this can't be interpolated
// in particular: wordify({ suffix: [{ suffix object }] })`...`
function parseWord({
  suffix = null,
  prefix = null,
  automaticStress = null,
  augmentation = null
} = {}) {
  return (strings, ...rootConsonants) => {
    // by convention i'm gonna do all-or-nothing
    // ie either stress is automatic or EVERY syllable is marked for it
    // ...so i can use the very first char of the first string chunk to
    // determine whether or not the whole string is marked for stress
    let alreadyStressed = strings[0].startsWith(`-`) || strings[0].startsWith(`+`);

    // normalize individual orthographic segments
    const syllables = [...initialSyllables(prefix)];
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
          alreadyStressed = true;  // just in case i forget that convention tho
          lastSyllable.meta.stressed = chunk.startsWith(`+`);
          chunk = chunk.slice(1);
        }
        lastSyllable.value.push(
          ...chunk.split(`.`)  // m.u.s._.t > [m, u, s, _, t, ...]
            .filter(c => abc[c])  // to avoid undefined later
            .map(c => obj.process(abc[c]))  // -> corresponding objects
        );
      });
      if (rootConsonants.length) {
        lastSyllable.value.push(rootConsonants.shift());
      }
    });

    // set weight of each syllable
    syllables.forEach(s => {
      // 0 segments in syllable = weight of -1
      // 1 segment in syllable = weight of 0
      if (s.value.length <= 1) {
        s.meta.weight = s.value.length - 1;
        return;
      }
      // otherwise just count sound units
      let rimeLength = 0;
      // go backwards so we can break when we reach the nucleus (aka before the onset)
      for (let i = s.value.length - 1; i > 0; i -= 1) {
        const segment = s.value[i];
        // long vowels add 2, short vowels add 1
        if (segment.type === `vowel`) {
          rimeLength += segment.meta.length;
          break;
        }
        if (segment.type === `consonant`) {
          // consonants just add 1
          rimeLength += 1;
        }
        // the remaining type is epenthetic, which adds 0
      }
      s.meta.weight = rimeLength;
    });

    // add suffix & reassign stress to it if superheavy
    // (this is after normal stress-assignment bc suffixes are special symbols)
    if (suffix) {  // not triggered if suffix is either null or []
      if (
        suffix.length === 2
        && suffix[0].value === `fem`
        && suffix[1].value === `dual`
      ) {
        syllables.push(obj.obj(
          `syllable`,
          { stressed: null, weight: 3 },
          [...suffix]
        ));
      } else {
        lastOf(syllables).meta.weight -= 1;
        syllables.push(obj.obj(
          `syllable`,
          {
            stressed: null,
            // superheavy if dual or m/f plural, light if fsg
            // (should handle this less-hackily but w/e)
            weight: suffix[0].value === `fem` ? 1 : 3
          },
          [lastOf(syllables).value.pop(), ...suffix]
        ));
      }
    }

    // set stressed syllable (if meant to be automatically assigned)
    if (!alreadyStressed || automaticStress) {
      if (syllables.length === 1) {
        syllables[0].meta.stressed = true;
      }
      if (syllables.length === 2) {
        if (lastOf(syllables).meta.weight >= 3) {
          lastOf(syllables).meta.stressed = true;
        } else {
          lastOf(syllables, 1).meta.stressed = true;
        }
      }
      if (syllables.length >= 3) {
        if (lastOf(syllables).meta.weight >= 3) {
          lastOf(syllables).meta.stressed = true;
        } else if (lastOf(syllables, 1).meta.weight >= 2) {
          lastOf(syllables, 1).meta.stressed = true;
        } else {
          lastOf(syllables, 2).meta.stressed = true;
        }
      }

      // mark all not-stressed syllables as unstressed
      // (either as a continuation of the above step,
      // or as a cover for if i forget my convention and
      // only mark a + syllable without marking any -)
      syllables.forEach(s => {
        if (s.meta.stressed !== true) {
          s.meta.stressed = false;
        }
      });

      // add schwa to CVCC syllables
      syllables.forEach(s => {
        if (s.meta.weight === 3 && s.value.length === 4) {
          // this SHOULD always be true but just in case
          if (
            lastOf(s.value).type === `consonant`
            && lastOf(s.value, 1).type === `consonant`
          ) {
            s.value.push(
              obj.process(abc.Schwa),
              s.value.pop()
            );
          }
        }
      });
    }
    return obj.obj(`word`, { augmentation }, syllables);
  };
}

function createWordParserTag(postprocess = null) {
  return (first, ...rest) => {
    if (Array.isArray(first)) {
      // this means the caller just wants the template tag
      const ret = parseWord()(first, ...rest);
      return postprocess ? postprocess(ret) : ret;
    }
    // this means the caller wants to pass config params to the tag
    const ret = parseWord(first);
    return postprocess ? (...args) => postprocess(ret(...args)) : ret;
  };
}

module.exports = {
  parseWord: createWordParserTag(),
  parseSyllable: createWordParserTag(word => {
    word.value[0].meta.stressed = null;
    return word.value[0];
  }),
  parseString: createWordParserTag(word => word.value[0].value),
  parseLetter: createWordParserTag(word => word.value[0].value[0])
};
