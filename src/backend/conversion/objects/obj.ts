export class Obj<T extends number, V> {
  type: T;
  meta: Record<string, any>;
  value: V;
  context: Set<string>;

  constructor(type: T, meta: Record<string, any>, value: V, context: Iterable<string> = new Set()) {
    this.type = type;
    this.meta = meta;
    this.value = value;
    this.context = new Set(context);
  }

  // Initialization is the process that'll turn e.g. (verb [...]) into a set of
  // variants like [3aTct, 3aTyct]
  init(initializers: Function[]): any | any[] {
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

  ctx(item: string) {
    this.context.add(item);
  }
}

interface ParseObject<T extends number, V> {
  type?: T,
  meta?: Record<string, any>
  value?: V,
  context?: Iterable<string>
}

export function obj<T extends number, V>(type: T, meta: Record<string, any>, value: V, context?: Iterable<string>) {
  return new Obj<T, V>(type, meta, value, context);
}

// gives an already-created object a resolver+transformer
export function process<T extends number, V>({type, meta = {}, value, context}: ParseObject<T, V>) {
  return obj(type, meta, value, context);
}

export function edit<T extends number, P extends number, U>(og: ParseObject<T, V>, {type, meta, value, context}: ParseObject<P, U>) {
  return obj(
    type ?? og.type,
    {...og.meta, ...meta},
    value ?? og.value,
    context ?? og.context,
  );
}
