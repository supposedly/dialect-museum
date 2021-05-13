const { misc: { lastOf }, parseWord: { parseString: $, parseLetter }} = require(`../utils`);
const _ = require(`../objects`);
const { PERSONS: P, GENDERS: G, NUMBERS: N } = require(`../symbols`);

const I = Object.freeze(parseLetter`i`);
const FEM_T = Object.freeze(_.edit(parseLetter`Fem`, { meta: { t: true }}));

// circumfix-generator for verbCircumfix()
const suffixPrefix = (suffix, [cc, cv], indicative = $`b`) => ({
  prefix: {
    indicative,
    subjunctive: {
      cc: [...cc, I],
      cv: cv !== undefined ? cv : cc
    }
  },
  suffix
});

function ppSuffix(person, gender, number) {
  // person only matters when clitics are added so we ignore it here
  if (gender.fem()) {
    if (number.singular()) { return $`Fem`; }
    if (number.dual()) { return $`Fem.Dual`; }
    if (number.plural()) { return $`FemPlural`; }
    throw new Error(
      `Unrecognized conjugation for participles: ${person.value}${gender.value}${number.value}`
    );
  }
  // masc and "commmon" gender are the same for now
  if (number.singular()) { return $``; }
  if (number.dual()) { return $`Dual`; }  // merging verbal and nominal participles here
  if (number.plural()) { return $`Plural`; }
  throw new Error(
    `Unrecognized conjugation for participles: ${person.value}${gender.value}${number.value}`
  );
}

// past-tense verbs
function verbSuffix(person, gender, number) {
  if (person.first()) {
    if (number.singular()) { return $`t`; }
    return $`n.aa`;
  }
  if (person.second()) {
    if (number.singular()) {
      if (gender.fem()) { return $`t.ii`; }
      return $`t`;
    }
    return $`t.uu`;
  }
  if (person.third()) {
    if (number.singular()) {
      if (gender.fem()) { return [FEM_T]; }  // -it/-at
      return $``;
    }
    return $`uu`;
  }
  throw new Error(
    `Unrecognized conjugation for verbs: ${person.value}${gender.value}${number.value}`
  );
}

// nonpast verbs
function verbCircumfix(person, gender, number) {
  if (person.first()) {
    if (number.singular()) {
      // 1cs
      return suffixPrefix($``, [$`2`, $``]);
    }
    // "1cd", 1cp
    return suffixPrefix($``, [$`n`]);
  }
  if (person.second()) {
    if (number.singular()) {
      if (gender.fem()) {
        // 2fs
        return suffixPrefix($`ii`, [$`t`]);
      }
      // 2ms, 2cs
      return suffixPrefix($``, [$`t`]);
    }
    // 2cd, 2cp
    return suffixPrefix($`uu`, [$`t`]);
  }
  if (person.third()) {
    if (number.singular()) {
      if (gender.fem()) {
        // 3fs
        return suffixPrefix($``, [$`t`]);
      }
      // 3ms, 3cs
      return suffixPrefix($``, [$`y`]);
    }
    // 3cp
    return suffixPrefix($`uu`, [$`y`]);
  }
  throw new Error(
    `Unrecognized conjugation for verbs: ${person.value}${gender.value}${number.value}`
  );
}

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
          // -un, -in
          natural(1),
          // -hun/-hin
          stress(0)
        ],
        // -un, -in
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

// value is a string but we can still destructure it
function pronoun({ value: [person, gender, number, n] }) {
  person = {
    value: person,
    first() { return this.value === P.first; },
    second() { return this.value === P.second; },
    third() { return this.value === P.third; }
  };
  gender = {
    value: gender,
    masc() { return this.value === G.masc; },
    fem() { return this.value === G.fem; },
    common() { return this.value === G.common; }
  };
  number = {
    value: number,
    singular() { return this.value === N.singular; },
    dual() { return this.value === N.dual; },
    plural() { return this.value === N.plural; }
  };
  // 0 = no N for 1s clitic
  // 1 = optional N for 1s clitic (like صرني and كلني stuff)
  // 2 = required N
  // needless to say this is bad and hacky lol
  // eslint-disable-next-line no-nested-ternary
  n = (n === `N` || n === 2) ? 2 : (n === `n` || n === 1) ? 1 : 0;

  return {
    person,
    gender,
    number,
    misc: {
      n() { return n; }
    },
    participle: {
      suffix: ppSuffix(person, gender, number)
    },
    past: {
      suffix: verbSuffix(person, gender, number),
      // returns true if this suffix creates a "heavier" syllable than CV at the end of the stem
      // in other words, returns true if this suffix has -ay- before it in a geminate past verb
      heavier() {
        const initial = this.suffix[0];
        return initial && (initial.type === `consonant` || initial.type === `epenthetic`);
      }
    },
    nonpast: verbCircumfix(person, gender, number),
    clitic: clitic(person, gender, number, n)
  };
}

module.exports = {
  pronoun
};
