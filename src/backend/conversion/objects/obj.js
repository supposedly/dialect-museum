class Obj {
  constructor(type, meta, value, context = new Set()) {
    this.type = type;
    this.meta = meta;
    this.value = value;
    this.context = new Set(context);
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
        result => (result instanceof Obj ? result.init(initializers) : result),
      );
    }
    return initialized;
  }

  ctx(item) {
    this.context.add(item);
  }
}

export function obj(type, meta, value, context) {
  return new Obj(type, meta, value, context);
}

// gives an already-created object a resolver+transformer
export function process({type, meta, value, context}) {
  return obj(type, meta, value, context);
}

export function edit(og, {type, meta, value, context}) {
  return obj(
    type || og.type,
    {...og.meta, ...meta},
    value || og.value,
    context || og.context,
  );
}
