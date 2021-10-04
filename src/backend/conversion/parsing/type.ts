enum ObjType {
  // XXX: it's important (as long as i'm using this hack enum func) for `suffix` and `prefix` to
  // remain at position 0 in this order, just like in the segment-type enum over in ../objects
  // (what's actually important is that they just have the same indices but w/e)
  // the reason it's important is in word.js
  suffix,
  prefix,
  augmentation,
  pronoun,
  stem,
  word,
  syllable,
  // tag types
  pp,
  verb,
  l,
  idafe,
  tif3il,
  af3al,
  number,
}

export default ObjType;
