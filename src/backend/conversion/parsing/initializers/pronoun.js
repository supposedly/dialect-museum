import type from '../type';
import { parseString as $, parseLetter } from '../../parse-word';
/* const {obj} = require('../../objects'); */
import { PERSON as P, GENDER as G, NUMBER as N } from '../../symbols';

const I = Object.freeze(parseLetter`i`);
/* const FEM_T = Object.freeze(obj.edit(parseLetter`c`, {meta: {t: true}})); */

const _ = {
  FEM: $`c`,
  FEM_DUAL: $`c.Dual`,
  FEM_PLURAL: $`c.Plural`,
  NOTHING: $``,
  DUAL: $`Dual`,
  PLURAL: $`Plural`,
  T: $`t`,
  NAA: $`n.aa`,
  TII: $`t.ii`,
  TUU: $`t.uu`,
  II: $`ii`,
  UU: $`uu`,
  HAMZE: $`2`,
  N: $`n`,
  Y: $`y`,
  B: $`b`,
};

// circumfix-generator for verbCircumfix()
const suffixPrefix = (suffix, [cc, cv], indicative = _.B) => ({
  prefix: {
    indicative,
    subjunctive: {
      cc: [...cc, I],
      cv: cv !== undefined ? cv : cc,
    },
  },
  suffix,
});

function ppSuffix(person, gender, number) {
  // person only matters when clitics are added so we ignore it here
  if (gender.fem()) {
    if (number.singular()) { return _.FEM; }
    if (number.dual()) { return _.FEM_DUAL; }
    if (number.plural()) { return _.FEM_PLURAL; }
    throw new Error(
      `Unrecognized conjugation for participles: ${person.value}${gender.value}${number.value}`,
    );
  }
  // masc and "commmon" gender are the same for now
  if (number.singular()) { return _.NOTHING; }
  if (number.dual()) { return _.DUAL; }  // merging verbal and nominal participles here
  if (number.plural()) { return _.PLURAL; }
  throw new Error(
    `Unrecognized conjugation for participles: ${person.value}${gender.value}${number.value}`,
  );
}

// past-tense verbs
function verbSuffix(person, gender, number) {
  if (person.first()) {
    if (number.singular()) { return _.T; }
    return _.NAA;
  }
  if (person.second()) {
    if (number.singular()) {
      if (gender.fem()) { return _.TII; }
      return _.T;
    }
    return _.TUU;
  }
  if (person.third()) {
    if (number.singular()) {
      if (gender.fem()) { return [_.FEM]; }  // -it/-at
      return _.NOTHING;
    }
    return _.UU;
  }
  throw new Error(
    `Unrecognized conjugation for verbs: ${person.value}${gender.value}${number.value}`,
  );
}

// nonpast verbs
function verbCircumfix(person, gender, number) {
  if (person.first()) {
    if (number.singular()) {
      // 1cs
      return suffixPrefix(_.NOTHING, [_.HAMZE, _.NOTHING]);
    }
    // "1cd", 1cp
    return suffixPrefix(_.NOTHING, [_.N]);
  }
  if (person.second()) {
    if (number.singular()) {
      if (gender.fem()) {
        // 2fs
        return suffixPrefix(_.II, [_.T]);
      }
      // 2ms, 2cs
      return suffixPrefix(_.NOTHING, [_.T]);
    }
    // 2cd, 2cp
    return suffixPrefix(_.UU, [_.T]);
  }
  if (person.third()) {
    if (number.singular()) {
      if (gender.fem()) {
        // 3fs
        return suffixPrefix(_.NOTHING, [_.T]);
      }
      // 3ms, 3cs
      return suffixPrefix(_.NOTHING, [_.Y]);
    }
    // 3cp
    return suffixPrefix(_.UU, [_.Y]);
  }
  throw new Error(
    `Unrecognized conjugation for verbs: ${person.value}${gender.value}${number.value}`,
  );
}

// value is a string but we can still destructure it
export default function pronoun({value: [person, gender, number]}) {
  person = {
    value: person,
    first() { return this.value === P.first; },
    second() { return this.value === P.second; },
    third() { return this.value === P.third; },
  };
  gender = {
    value: gender,
    masc() { return this.value === G.masc; },
    fem() { return this.value === G.fem; },
    common() { return this.value === G.common; },
  };
  number = {
    value: number,
    singular() { return this.value === N.singular; },
    dual() { return this.value === N.dual; },
    plural() { return this.value === N.plural; },
  };

  return {
    person,
    gender,
    number,
    participle: {
      suffix: ppSuffix(person, gender, number),
    },
    past: {
      suffix: verbSuffix(person, gender, number),
      // returns true if this suffix creates a "heavier" syllable than CV at the end of the stem
      // in other words, returns true if this suffix has -ay- before it in a geminate past verb
      heavier() {
        const initial = this.suffix[0];
        return initial && (initial.type === type.consonant || initial.type === type.epenthetic);
      },
    },
    nonpast: verbCircumfix(person, gender, number),
  };
}
