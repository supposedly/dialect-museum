const { misc: { lastOf }} = require(`../utils`);
const { parseLetter } = require(`../parse-word`);

const L = Object.freeze(parseLetter`l`);

// 0, 1, 2
const N_VALUES = [`yFor1sg`, `bothFor1sg`, `nFor1sg`];

// special = like in 'fiyyo'
function cliticInContext(
  { default: basic, vc },
  afterSemivowel,
  { ay, aw, ii, iy, uu, uw, aa } = {},
  special
) {
  return {
    default: basic,
    after: {
      ay: ay || afterSemivowel || basic,
      aw: aw || afterSemivowel || basic,
      aa: aa || afterSemivowel || basic,
      ii: ii || iy || afterSemivowel || basic,
      iy: iy || ii || afterSemivowel || basic,
      uu: uu || uw || afterSemivowel || basic,
      uw: uw || uu || afterSemivowel || basic,
      cc: basic,
      vc: [...(vc || []), ...basic],
      special
    },
    afterEndOf(segments) {
      const a = lastOf(segments);
      const b = lastOf(segments, 1);
      if (b.type === `vowel` && b.length === 2) {
        return this.after[b.value];
      }
      if (
        a.type === `vowel` && a.length === 1
        && b.type === `consonant` && !b.meta.intrinsic.ly.semivocalic
      ) {
        return this.after.vc;
      }
      // the `a === Fem` case is also handled here
      return this.after[`${a.value}${b.value}`] || this.default;
    }
  };
}

// forcibly stress previous syllable
function stress(syllable) {
  return { syllable, stress: true };
}

// don't forcibly stress previous syllable
function natural(syllable) {
  return { syllable, stress: false };
}

// stress: true=stress the syllable before (even if it wouldn't naturally be stressed)
// syllable: -1=attach to last syllable, 0=new syllable, 1=pull last consonant into new syllable
function clitic(person, gender, number, n) {
  if (person.first()) {
    if (number.singular()) {
      switch (n) {
        case 2:
          return cliticInContext(
            // -ni
            { default: [stress(0)] }
          );
        case 1:
          return cliticInContext(
            // -i, ni
            { default: [natural(1), stress(0)] },
            // -yi, (-wi?), -ni
            [stress(0)]
          );
        default:
        case 0:
          return cliticInContext(
            // -i
            { default: [natural(0)] },
            // -yi, (-wi?)
            [stress(0)]
          );
      }
    }
    return cliticInContext(
      // -na
      { default: [stress(0)] }
    );
  }
  if (person.second()) {
    if (number.singular()) {
      if (gender.fem()) {
        return cliticInContext(
          // -ik
          { default: [natural(1)] },
          // -ki
          [stress(0)]
        );
      }
      return cliticInContext(
        // -ak
        { default: [natural(1)] },
        // -k
        [stress(-1)]
      );
    }
    return cliticInContext(
      // -kun/-kin
      { default: [stress(0)] }
    );
  }
  if (person.third()) {
    if (number.singular()) {
      if (gender.fem()) {
        return cliticInContext(
          {
            default: [
              // -a
              natural(1),
              // -ha
              stress(0)
            ],
            // -a
            vc: [stress(1)]
          },
          // -ya, -wa, -ha
          [stress(0)]
        );
      }
      return cliticInContext(
        // -o; -o
        { default: [natural(1)], vc: [stress(1)] },
        // -null
        [stress(-1)],
        {},
        // -yo, (-wo?); e.g. fiyyo
        [stress(0)]
      );
    }
    return cliticInContext(
      {
        default: [
          // -un/-in
          natural(1),
          // -hun/-hin
          stress(0)
        ],
        // -un/-in
        vc: [stress(1)]
      },
      // -yun/-yin, -wun/-win, -hun/-hin
      [stress(0)]
    );
  }
  throw new Error(
    `Unrecognized augmented pronoun: ${person.value}${gender.value}${number.value}`
  );
}

function makeAugmentor(delimiter, person, gender, number, makeEnd = null, allN = null) {
  return base => Object.fromEntries(N_VALUES.map((n, i) => [
    n,
    {
      delimiter,
      pronoun: { person, gender, number },
      clitics: clitic(person, gender, number, allN || i).afterEndOf(
        makeEnd
          ? makeEnd(base)
          : lastOf(base).value
      )
    }
  ]));
}

// not sure if this and pronouns.js should return { type, meta, value } objs or not
function augmentation({
  meta: { delimiter },
  value: { person, gender, number }
}) {
  if (delimiter.value === `dative`) {
    return makeAugmentor(
      delimiter,
      person,
      gender,
      number,
      base => [lastOf(lastOf(base).value), L],
      0  // all N values are 0 because 1sg datives can't be -lni
    );
  }
  return makeAugmentor(
    delimiter,
    person,
    gender,
    number
  );
}

module.exports = {
  augmentation
};
