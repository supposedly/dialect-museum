import underlying from '/languages/levantine/rule-packs/north-levantine/underlying/phonic';

const fem = underlying.affix.f(
  (is, when) => [
    when.inConstruct(
      ...when.willBeAfterA(
        // raqbato, raqabat
        is.at(),
      ),
      is.it(),
    ),
    when.afterBackConsonant(
      is.a(),
    ),
    when.afterEmphatic(
      is.a(),
    ),
    is.e(),
  ]
);

const indicative = underlying.affix.indicative(
  (is, when) => [
    when.beforeNasalPrefix(
      is.m(),
    ),
    is.b(),
  ]
);

const dative = underlying.delimiter.dative.afterSuperheavy(
  (is, when) => [
    when.afterA(
      ...when.afterForm1(
        ...when.afterNonpast(
          is.ill(),
        )
      ),
      is.all(),
    ),
    is.ill(),
  ]
);

const ayCleanup = underlying.vowel.diphthong.ay(
  is => [
    is.vocalic(),
  ]
);

const awCleanup = underlying.vowel.diphthong.aw(
  is => [
    is.vocalic(),
  ]
);

export default {
  rules: [
    fem,
    indicative,
    dative,
    ayCleanup,
    awCleanup,
  ],
  orderings: [],
  children: [],
};
