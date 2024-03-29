import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const epenthetic = phonic.cvcc.epenthetic(
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
