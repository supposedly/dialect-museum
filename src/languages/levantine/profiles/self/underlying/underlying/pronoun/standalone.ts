import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';

export const pl1 = underlying.pronoun.standalone.firstPerson.plural(is => [is.ni7na()]);

export const sg2Stem = underlying.pronoun.standalone.secondPerson.stem(
  is => [is.int()]
);
export const msg2 = underlying.pronoun.standalone.secondPerson.singular.masculine(
  ending => [ending.aa()]
);

export const msg3 = underlying.pronoun.standalone.thirdPerson.singular.masculine(
  is => [
    is.base.huu(),
    is.ending.we(),
  ]
);
export const fsg3 = underlying.pronoun.standalone.thirdPerson.singular.feminine(
  is => [
    is.base.hii(),
    is.ending.ye(),
  ]
);
export const pl3 = underlying.pronoun.standalone.thirdPerson.plural(
  is => [
    is.base.hinn(),
    is.ending.e(),
  ]
);
