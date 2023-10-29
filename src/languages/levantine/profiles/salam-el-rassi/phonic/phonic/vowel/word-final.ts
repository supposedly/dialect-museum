import phonic from '/languages/levantine/rule-packs/north-levantine/phonic/phonic';

const e = phonic.vowel.wordFinal.shift.ie(
  is => [
    is.e(),
  ]
);

const o = phonic.vowel.wordFinal.shift.uo(
  is => [
    is.o(),
  ]
);

export default {
  rules: [
    e,
    o,
  ],
  orderings: [],
  children: [],
};
