import phonic from '/languages/levantine/rule-packs/north-levantine/phonic/phonic';

const epenthetic = phonic.cvcc.epenthetic(
  (is, when) => [
    when.n_T(
      is.e(50),  // idk if this actually works as a guard
    ),
    is.e(50),
  ]
);

export default {
  rules: [
    epenthetic,
  ],
  orderings: [],
  children: [],
};
