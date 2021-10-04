export enum DepType {
  /* constant dependencies */
  word,
  type,
  /* reactive dependencies */
  prev,
  next,
  prevConsonant,
  nextConsonant,
  prevVowel,
  nextVowel,
}

export enum TransformType {
  transformation,
  expansion,
  promotion,
}
