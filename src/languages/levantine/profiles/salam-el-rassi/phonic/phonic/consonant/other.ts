import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

// need some way to represent is mina, 3ana (if he has 3ana)
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

export default {
  rules: [
    h,
  ],
  orderings: [],
  children: [],
};
