import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const ay = phonic.vowel.original.diphthong.ay(
  (is, when) => [
    when.inFinalSyllable(
      is.ee(),
    ),
  ]
);

export const aw = phonic.vowel.original.diphthong.aw(
  (is, when) => [
    when.inFinalSyllable(
      is.oo(),
    ),
  ]
);
