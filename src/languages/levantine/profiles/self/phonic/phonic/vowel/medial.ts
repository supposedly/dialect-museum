import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const preFinalI = phonic.vowel.medial.i(
  (is, when) => [
    when.unstressedOpen(
      is.deleted(),
    ),
    // TODO: affected i should be e too
    when.stressed(
      is.e(),
    ),
  ]
);

export const u = phonic.vowel.medial.u(
  (is, when) => [
    when.unstressedOpen.negated(
      is.o(),
    ),
  ]
);

export const o = phonic.vowel.medial.o(
  (is, when) => [
    when.inFinalSyllable.negated(
      is.e(),
    ),
  ]
);

export const e = phonic.vowel.medial.e(
  (is, when) => [
    when.nextToEmphatic(
      is.o(),
    ),
  ]
);

// first time I'll need to use ordering for a rule I myself wrote!!
// but it still doesn't need to go in `orderings` since they're all in the same file...
export const finalSyllableI = phonic.vowel.medial.i(
  (is, when) => [
    when.inFinalSyllable(
      is.e(),
    ),
  ]
);
