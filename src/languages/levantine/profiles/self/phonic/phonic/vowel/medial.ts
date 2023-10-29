import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

const preFinalI = phonic.vowel.medial.i(
  (is, when) => [
    when.unstressedOpen(
      is.deleted(),
    ),
    when.stressed(
      is.e(),
    ),
  ]
);

const u = phonic.vowel.medial.u(
  (is, when) => [
    when.unstressedOpen.negated(
      is.o(),
    ),
  ]
);

const o = phonic.vowel.medial.o(
  (is, when) => [
    when.inFinalSyllable.negated(
      is.e(),
    ),
  ]
);

const e = phonic.vowel.medial.e(
  (is, when) => [
    when.nextToEmphatic(
      is.o()
    ),
  ]
);

// first time I'll need to use ordering for a rule I myself wrote!!
// but it still doesn't need to go in `orderings` since they're all in the same file...
const finalSyllableI = phonic.vowel.medial.i(
  (is, when) => [
    when.inFinalSyllable(
      is.e()
    ),
  ]
);

export default {
  rules: [
    preFinalI,
    u,
    o,
    e,
    finalSyllableI,
  ],
  orderings: [],
  children: [],
};
