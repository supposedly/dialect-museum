// as in, like, a parse-tree node
class Node {
  constructor(type, meta, value) {
    this.type = type;
    this.meta = meta;
    this.value = value;
  }

  // Initialization is the process that'll turn e.g. (verb [...]) into a set of
  // variants like [3aTct, 3aTyct]
  init(initializers) {
    const initializer = initializers[this.type];
    if (!initializer) {
      return this;
    }
    const initialized = initializer(this);
    if (Array.isArray(initialized)) {
      // should only be an array of either 100% Nodes or 100% initialized non-Nodes
      // but not enforcing that strictly bc js
      return initialized.map(
        result => (result instanceof Node ? result.init(initializers) : result)
      );
    }
    return initialized;
  }
}

module.exports.obj = (type, meta = {}, value) => new Node(type, meta, value);

// gives an already-created object a resolver+transformer
module.exports.process = ({ type, meta, value }) => this.obj(type, meta, value);

module.exports.edit = (og, { type, meta, value }) => this.obj(
  type || og.type,
  { ...og.meta, ...meta },
  value || og.value
);
