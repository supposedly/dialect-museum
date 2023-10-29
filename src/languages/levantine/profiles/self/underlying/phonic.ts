import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/phonic';

export const fem = underlying.affix.f(
  (is, when) => [
    when.inConstruct(
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

export const indicative = underlying.affix.indicative(
  (is, when) => [
    when.beforeNasalPrefix(
      is.m(),
    ),
    is.b(),
  ]
);

export const dative = underlying.delimiter.dative.afterSuperheavy(
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

export const ayCleanup = underlying.vowel.diphthong.ay(
  is => [
    is.vocalic(),
  ]
);

export const awCleanup = underlying.vowel.diphthong.aw(
  is => [
    is.vocalic(),
  ]
);
