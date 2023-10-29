import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

const ay = phonic.vowel.original.diphthong.ay(
  (is, when) => [
    when.inFinalSyllable(
      is.ee(),
    ),
  ]
);

const aw = phonic.vowel.original.diphthong.aw(
  (is, when) => [
    when.inFinalSyllable(
      is.oo(),
    ),
  ]
);

export default {
  rules: [
    ay,
    aw,
  ],
  orderings: [],
  children: [],
};
