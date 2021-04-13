function parseSubject(person, gender, number) {
  const parse = {

  }
}

function parseConj(conjugationString) {
  const person = conjugationString[0];
  const gender = conjugationString[1];
  const number = conjugationString[2];

  const parse = {
    object: {
      suffixes: undefined
    },
    subject: {
      pronouns: [],
      verb: {
        circumfixes: []
      },
      pp: {
        suffixes: []
      },
      pseudoverb: {
        suffixes: []
      }
    },
    possessive: {
      suffixes: []
    },
    dative: {
      suffixes: []
    }
  };

  return {
    ...parse,
    person,
    gender,
    number
  };
}

module.exports = {
  parseConj
};
