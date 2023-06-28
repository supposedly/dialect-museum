export class Obj<T extends number, V> {
  constructor(
    public type: T,
    public meta: Record<string, any>,
    public value: V,
    public context: Set<string> = new Set(),
  ) {
    this.type = type;
    this.meta = meta;
    this.value = value;
    this.context = new Set(context);
  }

  ctx(item: string) {
    this.context.add(item);
  }
}

interface ParseObject<T extends number, V> {
  type: T,
  meta?: Record<string, any>
  value?: V,
  context?: Set<string>
}

export function obj<T extends number, V>(type: T, meta: Record<string, any>, value: V, context?: Set<string>) {
  return new Obj<T, V>(type, meta, value, context);
}

// gives an already-created object a resolver+transformer
export function process<T extends number, V>({type, meta = {}, value, context}: ParseObject<T, V>) {
  return obj(type, meta, value, context);
}

export function edit<T extends number, P extends number, U, V>(og: ParseObject<T, V>, {type, meta, value, context}: ParseObject<P, U>) {
  return obj(
    type ?? og.type,
    {...og.meta, ...meta},
    value ?? og.value,
    context ?? og.context,
  );
}
