export function lastOf<T>(seq: T[], index = 0): T { return seq[seq.length - 1 - index]; }

export function lastIndex<T>(seq: T[], index = 0): keyof T[] { return seq.length - 1 - index; }

// wrapper to give array.map an "or" method if empty
export function backup<T>(array: T[]) {
  const originalMap = array.map;
  array.map = function newMap(...args) {
    // not sure if the bind is needed
    const result = originalMap.bind(this)(...args);
    // this is the "default"
    result.or = (
      array.length === 0
        ? <E>(...backups: E[]) => backups
        : (_: unknown) => result
    );
    return result;
  };
  return array;
}
