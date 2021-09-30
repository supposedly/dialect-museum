export function lastOf(seq, index = 0) { return seq[seq.length - 1 - index]; }

export function lastIndex(seq, index = 0) { return seq.length - 1 - index; }

// wrapper to give array.map an "or" method if empty
export function backup(array) {
  const originalMap = array.map;
  array.map = function newMap(...args) {
    // not sure if the bind is needed
    const result = originalMap.bind(this)(...args);
    // this is the "default"
    result.or = (
      array.length === 0
        ? (...backups) => backups
        : _ => result
    );
    return result;
  };
  return array;
}
