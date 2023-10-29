import underlying from '/languages/levantine/rule-packs/north-levantine/underlying/underlying';

const pl1 = underlying.pronoun.standalone.firstPerson.plural(is => [is.ni7na()]);

const sg2Stem = underlying.pronoun.standalone.secondPerson.stem(
  is => [is.int()]
);
const msg2 = underlying.pronoun.standalone.secondPerson.singular.masculine(
  ending => [ending.aa()]
);

const msg3 = underlying.pronoun.standalone.thirdPerson.singular.masculine(
  is => [
    is.base.huu(),
    is.ending.we(),
  ]
);
const fsg3 = underlying.pronoun.standalone.thirdPerson.singular.feminine(
  is => [
    is.base.hii(),
    is.ending.ye(),
  ]
);
const pl3 = underlying.pronoun.standalone.thirdPerson.plural(
  is => [
    is.base.hinn(),
    is.ending.e(),
  ]
);


export default {
  rules: [
    pl1,
    sg2Stem,
    msg2,
    msg3,
    fsg3,
    pl3,
  ],
  orderings: [],
};
