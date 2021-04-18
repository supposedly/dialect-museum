const { parseLetter: $ } = require(`../utils/parseWord`);
const { PERSONS: P, GENDERS: G, NUMBERS: N } = require(`../symbols`);

function ppSuffix(person, gender, number) {
  if (!person.third) {
    return null;  // error?
  }
  if (gender.fem) {
    if (number.singular) { return $`fem`; }
    if (number.dual) { return $`fdual`; }
    if (number.plural) { return $`fplural`; }
    return null;  // error?
  }
  // masc and "commmon" gender are the same for now
  if (number.singular) { return ``; }
  if (number.dual) { return $`=`; }
  if (number.plural) { return $`+`; }
  return null;  // error?
}

// past-tense verbs
function verbSuffix(person, gender, number) {
  if (person.first) {
    if (number.singular) { return $`naa`; }
    if (number.dual) { return $`naa`; }
    if (number.plural) { return $`naa`; }
    return null;  // error?
  }
  if (person.second) {
    if (number.singular) {
      if (gender.fem) { return $`ii`; }
      return ``;
    }
  }
}

// nonpast verbs
function verbCircumfix(person, gender, number) {

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
    number
  };
}

module.exports = {
  pronoun
};
