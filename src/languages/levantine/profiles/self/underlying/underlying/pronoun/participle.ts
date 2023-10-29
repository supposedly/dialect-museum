import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';

export const fsg2 = underlying.pronoun.participle.fem.attached.sg2(
  is => [
    is.fs2(),  // tii
  ]
);
export const fsg = underlying.pronoun.participle.fem.attached.other(
  is => [
    is.iit(),
  ]
);

export const plural = underlying.pronoun.participle.plural.fem(
  is => [
    is.iin(),
  ]
);
