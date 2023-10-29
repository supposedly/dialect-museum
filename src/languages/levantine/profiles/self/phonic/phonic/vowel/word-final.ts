import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const e = phonic.vowel.wordFinal.shift.ie(
  is => [
    is.e(),
  ]
);

export const o = phonic.vowel.wordFinal.shift.uo(
  is => [
    is.o(),
  ]
);
