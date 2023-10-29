import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

const dh = phonic.consonant.interdental.dh(
  (is, when) => [
    when.affected(
      is.assibilated(), 
    ),
    is.stopped(),
  ]
);

const DH = phonic.consonant.interdental.DH(
  (is, when) => [
    when.affected(
      is.assibilated(), 
    ),
    is.stopped(),
  ]
);

const th = phonic.consonant.interdental.th(
  (is, when) => [
    when.affected(
      is.assibilated(), 
    ),
    is.stopped(),
  ]
);

export default {
  rules: [
    dh,
    DH,
    th,
  ],
  orderings: [],
  children: [],
};
