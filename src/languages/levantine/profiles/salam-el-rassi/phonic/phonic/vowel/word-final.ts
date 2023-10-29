import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const e = phonic.vowel.wordFinal.shift.ie(
  is => [
    is.e(50),
    is.i(50),
  ]
);

export const o = phonic.vowel.wordFinal.shift.uo(
  is => [
    is.o(50),
    is.u(50),
  ]
);
