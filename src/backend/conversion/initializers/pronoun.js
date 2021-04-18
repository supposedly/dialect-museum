const { parseLetter, parseSyllable: $s } = require(`../utils/parseWord`);
const { PERSONS: P, GENDERS: G, NUMBERS: N } = require(`../symbols`);

// this param list is fine because i'm not using these as actual template strings for now
const $l = ([s]) => (s ? [parseLetter(s)] : []);

// circumfix-generator for verbCircumfix()
const suffixPrefix = (suffix, [cc, cv], indicative = $l`b`) => ({
  prefix: {
    indicative,
    subjunctive: {
      cc,
      cv: cv !== undefined ? cv : cc
    }
  },
  suffix
});

function ppSuffix(person, gender, number) {
  if (gender.fem) {
    if (number.singular) { return $l`Fem`; }
    if (number.dual) { return $l`FemDual`; }
    if (number.plural) { return $l`FemPlural`; }
    return null;  // error?
  }
  // masc and "commmon" gender are the same for now
  if (number.singular) { return $l``; }
  if (number.dual) { return $l`=`; }  // merging verbal and nominal participles here
  if (number.plural) { return $l`+`; }
  return null;  // error?
}

// past-tense verbs
function verbSuffix(person, gender, number) {
  if (person.first) {
    if (number.singular) { return $s`Schwa.t`; }
    return $s`n.aa`;
  }
  if (person.second) {
    if (number.singular) {
      if (gender.fem) { return $s`t.ii`; }
      return $s`Schwa.t`;
    }
    return $s`t.uu`;
  }
  if (person.third) {
    if (number.singular) {
      if (gender.fem) { return $l`Fem`; }  // -it/-at
      return $l``;
    }
    return $l`uu`;
  }
  return null;  // error?
}

// nonpast verbs
function verbCircumfix(person, gender, number) {
  if (person.first) {
    if (number.singular) {
      // 1cs
      return suffixPrefix($l``, [$l`2`, $l``]);
    }
    // "1cd", 1cp
    return suffixPrefix($l``, [$l`n`]);
  }
  if (person.second) {
    if (number.singular) {
      if (gender.feminine) {
        // 2fs
        return suffixPrefix($l`ii`, [$l`t`]);
      }
      // 2ms, 2cs
      return suffixPrefix($l``, [$l`t`]);
    }
    // 2cd, 2cp
    return suffixPrefix($l`uu`, [$l`t`]);
  }
  if (person.third) {
    if (number.singular) {
      if (gender.feminine) {
        // 3fs
        return suffixPrefix($l``, [$l`t`]);
      }
      // 3ms, 3cs
      return suffixPrefix($l``, [$l`y`]);
    }
    // 3cp
    return suffixPrefix($l`uu`, [$l`y`]);
  }
  return null;  // error?
}

function pronoun({ value }) {
  let person = value[0];
  let gender = value[1];
  let number = value[2];

  person = {
    value: person,
    first: person === P.first,
    second: person === P.second,
    third: person === P.third
  };

  gender = {
    value: gender,
    masc: gender === G.masc,
    fem: gender === G.fem,
    common: gender === G.common
  };

  number = {
    value: number,
    singular: number === N.singular,
    dual: number === N.dual,
    plural: number === N.plural
  };

  return {
    person,
    gender,
    number,
    ppSuffix: ppSuffix(person, gender, number),
    verbSuffix: verbSuffix(person, gender, number),
    verbCircumfix: verbCircumfix(person, gender, number)
  };
}

module.exports = {
  pronoun
};
