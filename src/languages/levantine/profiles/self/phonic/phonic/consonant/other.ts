import phonic from '/languages/levantine/rule-packs/north-levantine/phonic/phonic';

const plainR = phonic.consonant.r(
  is => [
    is.deemphasized(),
  ]
);

const h = phonic.consonant.encliticH(
  (is, when) => [
    when.is3ms(
      is.deleted(),
    ),
    when.afterVocalic.negated(
      is.deleted(75),
    ),
  ]
);

const q = phonic.consonant.q(
  is => [
    is.debuccalized(),
  ]
);

export default {
  rules: [
    plainR,
    h,
    q,
  ],
  orderings: [],
  children: [],
};
