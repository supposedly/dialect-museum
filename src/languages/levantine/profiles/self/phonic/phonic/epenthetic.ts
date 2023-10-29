import phonic from '/languages/levantine/rule-packs/lebanese/phonic/phonic';

const epenthetic = phonic.cvcc.epenthetic(
  (is, when) => [
    when.n_T(
      is.null(50),  // idk if this actually works as a guard
    ),
    when.afterBackA(
      // very sus! fix all this
      // ...when.nextToBilabial(
      is.o(),
      // ),
    ),
    when.afterRoundVowel(
      is.o(),
    ),
    is.e(90),
  ]
);

export default {
  rules: [
    epenthetic,
  ],
  orderings: [],
  children: [],
};
