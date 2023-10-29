import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const plainR = phonic.consonant.r(
  is => [
    is.deemphasized(),
  ]
);

export const h = phonic.consonant.encliticH(
  (is, when) => [
    when.is3ms(
      is.deleted(),
    ),
    when.afterVocalic.negated(
      is.deleted(75),
    ),
  ]
);

export const q = phonic.consonant.q(
  is => [
    is.debuccalized(),
  ]
);
