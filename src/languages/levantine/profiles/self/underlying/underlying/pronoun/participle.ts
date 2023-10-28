import underlying from '/languages/levantine/rule-packs/lebanese/underlying/underlying';

const fsg2 = underlying.pronoun.participle.fem.attached.sg2(
  is => [
    is.fs2(),  // tii
  ]
);
const fsg = underlying.pronoun.participle.fem.attached.other(
  is => [
    is.iit(),
  ]
);

const plural = underlying.pronoun.participle.plural.fem(
  is => [
    is.iin(),
  ]
);

export default {
  rules: [
    fsg2,
    fsg,
    plural,
  ],
  orderings: [],
};
