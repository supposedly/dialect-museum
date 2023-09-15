interface ParseObject<T, V> {
  type: T,
  features: Readonly<Record<string, any>>
  meta?: Record<string, any>
  value?: V,
  context?: Set<string>
}

export function obj<T extends number, V>(type: T, value: V, meta: Record<string, any> = {}, features: Readonly<Record<string, any>> = {}, context: Set<string> = new Set()): ParseObject<T, V> {
  return {type, features, meta, value, context};
}

// gives an already-created object a resolver+transformer
export function process<T extends number, V>({type, meta = {}, value, features, context}: ParseObject<T, V>) {
  return obj(type, value, meta, features, context);
}

export function edit<T extends number, P extends number, U, V>(og: ParseObject<T, V>, {type, meta, value, features, context}: ParseObject<P, U>) {
  return obj(
    type ?? og.type,
    value ?? og.value,
    {...og.meta, ...meta},
    features ?? og.features,
    context ?? og.context,
  );
}
