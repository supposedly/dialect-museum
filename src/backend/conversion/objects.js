// as in, like, a parse-tree node
class Node {
  constructor(type, meta, value) {
    this.type = type;
    this.meta = meta;
    this.value = value;
  }

  // Initialization is the process that'll turn e.g. (verb ...) into a set of
  // variants like [3aTit, 3aTyit]
  init(initializers) {
    return initializers[this.type](this);
  }

  // Transformation is a progressive/iterative process of turning initialized
  // nodes into, uh, other nodes that may then be turned into plain text; the difference btwn
  // it and initialization is that this will result in per-segment variants
  // like *[3aTyit] -> [[3] [a, o], [T], [y], [i, I], [t]]
  // (or something idk i'm on ramadan brain rn)
  transform(transformers) {
    return transformers[this.type](this);
  }
}

module.exports.obj = (type, meta, value) => new Node(type, meta, value);

// gives an already-created object a resolver+transformer
module.exports.process = ({ type, meta, value }) => this.obj(type, meta, value);

module.exports.edit = (og, { type, meta, value }) => this.obj(
  type || og.type,
  { ...og.meta, ...meta },
  value || og.value
);
