const resolvers = require(`./resolvers`);
const transformers = require(`./transformers`);

// as in, like, a parse-tree node
class Node {
  constructor(type, meta, value) {
    this.type = type;
    this.meta = meta;
    this.value = value;
  }

  transform() {
    return transformers[this.type](this);
  }

  resolve() {
    return resolvers[this.type](this);
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
