const { lastOf, lastIndex, newSyllable } = require(`./misc`);
const { alphabet: abc } = require(`../symbols`);
const obj = require(`../objects`);

function setWeights(syllables) {
  // set weight of each syllable
  const weights = syllables.map(s => {
    // 0 segments in syllable = weight of -1
    // 1 segment in syllable = weight of 0
    if (s.value.length <= 1) {
      return s.value.length - 1;
    }
    // otherwise just count sound units
    let rimeLength = 0;
    // go backwards so we can break when we reach the nucleus (aka before the onset)
    for (let i = s.value.length - 1; i > 0; i -= 1) {
      const segment = s.value[i];
      if (segment.type === `suffix`) {
        // should technically be rimeLength =
        // instead of rimeLength +=
        // but idk maybe if i have something bugged like `word=b` it'd
        // be good to handle it "properly" lol
        // (that is 'bugged' because it uses the dual suffix, `=`, non-word-finally)
        if (segment.value === `fem`) {
          // meta.t === false: suffix is V
          // meta.t === true: suffix is VC (as in Vt)
          rimeLength += 1 + segment.meta.t;
        } else {
          // all the other suffixes are VVC
          rimeLength += 3;
        }
        break;
      }
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
    return rimeLength;
  });

  weights.forEach((weight, idx) => {
    syllables[idx] = obj.edit(syllables[idx], { meta: { weight }});
  });
}

// determine & set stressed syllable according to weights
function setStressed(syllables) {
  const stress = idx => {
    syllables[idx] = obj.edit(syllables[idx], { meta: { stressed: true }});
  };

  if (syllables.length === 1) {
    stress(0);
  }

  const final = {
    idx: lastIndex(syllables),
    val: lastOf(syllables)
  };
  const penult = {
    idx: lastIndex(syllables, 1),
    val: lastOf(syllables, 1)
  };
  const antepenult = {
    idx: lastIndex(syllables, 2),
    val: lastOf(syllables, 2)
  };

  if (syllables.length === 2) {
    if (final.val.meta.weight >= 3) {
      stress(final.idx);
    } else {
      stress(penult.idx);
    }
  }

  if (syllables.length >= 3) {
    if (final.val.meta.weight >= 3) {
      stress(final.idx);
    } else if (penult.val.meta.weight >= 2) {
      stress(penult.idx);
    } else {
      stress(antepenult.idx);
    }
  }
}

// mark all not-stressed syllables as unstressed
// (aka normalize "either false or null" to "only false")
// (either as a continuation of the above,
// or as a cover for if i forget my convention and
// only mark a + syllable without marking any -)
function setBooleanStress(syllables) {
  syllables.forEach((s, idx) => {
    if (s.meta.stressed !== true) {
      syllables[idx] = obj.edit(s, { meta: { stressed: false }});
    }
  });
}

// add schwa to CVCC syllables
function addSchwa(syllables) {
  syllables.forEach((s, idx) => {
    if (
      s.meta.weight === 3
      && s.value.length === 4
      && lastOf(s.value).value !== lastOf(s.value, 1).value
    ) {
      syllables[idx] = obj.edit(
        s,
        s.meta,
        [s.value[0], s.value[1], s.value[3], abc.Schwa, s.value[4]]
      );
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
// As for `preTransform`, that's an array of functions that'll mutate the raw parse result
// which means they apply after parsing and syllabification but BEFORE syllable weight
// and stress (stress is automatic unless specified with +- UNLESS there are preTransform functions)
function parseWord({
  preTransform = [],
  postTransform = [],
  augmentation = null
} = {}) {
  return (strings, ...rootConsonants) => {
    // by convention i'm gonna do all-or-nothing
    // ie either stress is automatic or EVERY syllable is marked for it
    // ...so i can use the very first char of the first string chunk to
    // determine whether or not the whole string is marked for stress
    let alreadyStressed = strings[0].startsWith(`-`) || strings[0].startsWith(`+`);

    // normalize individual orthographic segments
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

    preTransform.forEach(f => f(syllables));

    setWeights(syllables);

    if (!alreadyStressed) {
      setStressed(syllables);
    }

    setBooleanStress(syllables);

    addSchwa(syllables);

    postTransform.forEach(f => f(syllables));

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
  parseString: createWordParserTag(word => word.value.map(s => s.value).flat()),
  parseLetter: createWordParserTag(word => word.value[0].value[0])
};
