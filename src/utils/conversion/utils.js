const { alphabet: abc } = require(`./symbols`);

const lastOf = (seq, index = 0) => seq[seq.length - 1 - index];

const newSyllable = () => ({
  type: `syllable`,
  meta: { stressed: null, weight: null },
  value: []
});

// split a template string written using the keys of ./symbols.js's alphabet object
// into syllable objects + consonant objects, incl. analyzing stress
// string format: `c.v c.v.c c.v` or `-c.v +c.v.c -c.v`, aka
// 1. syllables are separated manually (not worth it to do algorithmically lol) with
//    spaces, and individual orthographic segments are separated with periods
// 2. syllables can be optionally prefixed (preferably all at once) with - or +
//    to indicate stress, esp. useful when stress in a given word isn't automatic
module.exports.syllabify = (strings, ...rootConsonants) => {
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
      // again by convention i'm probably gonna do all-or-nothing
      // (ie either stress is automatic or EVERY syllable is marked)
      if (chunk.startsWith(`-`) || chunk.startsWith(`+`)) {
        alreadyStressed = true;  // just in case i forget that convention tho
        lastSyllable.meta.stressed = chunk.startsWith(`+`);
        chunk = chunk.slice(1);
      }
      lastSyllable.value.push(
        ...chunk.split(`.`)  // m.u.s._.t > [m, u, s, _, t, ...]
          .map(c => abc[c])  // -> corresponding objects
      );
    });
    if (rootConsonants.length) {
      lastSyllable.value.push(rootConsonants.shift());
    }
  });

  // set weight of each syllable
  syllables.forEach(s => {
    // remove undefined (which i think only appears when this
    // tag is passed the empty string)
    s.value = s.value.filter(sg => sg !== undefined);

    // 0 segments in syllable = weight of -1
    // 1 segment in syllable = weight of 0
    if (s.value.length <= 1) {
      s.meta.weight = s.value.length - 1;
      return;
    }
    // otherwise just count sound units
    let rimeLength = 0;
    for (let i = s.value.length - 1; i > 0; i -= 1) {
      // long vowels add 2, short vowels add 1
      if (s.value[i].type === `vowel`) {
        rimeLength += s.value[i].meta.length;
        break;
      }
      // else it's a consonant, which just adds 1
      rimeLength += 1;
    }
    s.meta.weight = rimeLength;
  });

  // set stressed syllable (if meant to be automatically assigned)
  if (!alreadyStressed) {
    if (syllables.length === 1) {
      syllables[0].stressed = true;
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
  }
  return syllables;
};
