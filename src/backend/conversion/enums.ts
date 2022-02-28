export enum Articulator {
  NULL = -1,
  throat,
  tongue,
  lips,
}

export enum Location {
  NULL = -1,
  glottis,
  pharynx,
  uvula,
  velum,
  palate,
  bridge,
  ridge,
  teeth,
  lips,
}

export enum Manner {
  NULL = -1,
  plosive,
  fricative,
  affricate,
  approximant,
  nasal,
  flap,
}

export enum SegType {
  NULL = -1,
  suffix,
  pronoun,
  augmentation,
  consonant,
  vowel,
  epenthetic,
  modifier,
  delimiter,
}

export enum Ps {
  first = 1,
  second = 2,
  third = 3
}

export enum Nb {
  singular = `s`,
  dual = `d`,
  plural = `p`
}

export enum Gn {
  masc = `m`,
  fem = `f`,
  common = `c`
}
