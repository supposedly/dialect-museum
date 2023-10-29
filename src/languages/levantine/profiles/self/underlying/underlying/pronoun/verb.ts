import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';

export const sg1Prefix = underlying.pronoun.prefix.firstPerson.singular.vowel(
  is => [
    is.i(),
  ],
);

export const fsg3Suffix = underlying.pronoun.suffix.past.thirdPerson.femSingular(
  (is, when) => [
    when.inFi3il(
      is.it(),
    ),
    when.beforeSuffix(
      is.at(),
    ),
    is.it(),
  ],
);

export const fsg2Enclitic = underlying.pronoun.enclitic.sg2.feminine(
  (is, when) => [
    when.afterVowel(
      is.ki(),
    ),
    is.ik(),
  ]
);

export const msg2Enclitic = underlying.pronoun.enclitic.sg2.masculine(
  (is, when) => [
    when.afterVowel(
      is.k(),
    ),
    is.ak(),
  ]
);

export const msg3Enclitic = underlying.pronoun.enclitic.thirdPerson.msg(
  (is, when) => [
    when.afterVowel(
      is.h(),
    ),
    is.o(),
  ]
);

export const pluralEnding = underlying.pronoun.enclitic.plural(
  is => [
    is.un(),
  ]
);

export default {
  rules: [
    sg1Prefix,
    fsg3Suffix,
    fsg2Enclitic,
    msg2Enclitic,
    msg3Enclitic,
    pluralEnding,
  ],
  orderings: [],
};
