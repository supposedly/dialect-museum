import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const dh = phonic.consonant.interdental.dh(
  (is, when) => [
    when.affected(
      is.assibilated(), 
    ),
    is.stopped(),
  ]
);

export const DH = phonic.consonant.interdental.DH(
  (is, when) => [
    when.affected(
      is.assibilated(), 
    ),
    is.stopped(),
  ]
);

export const th = phonic.consonant.interdental.th(
  (is, when) => [
    when.affected(
      is.assibilated(), 
    ),
    is.stopped(),
  ]
);
