import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';

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
