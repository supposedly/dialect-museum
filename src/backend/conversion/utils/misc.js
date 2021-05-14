module.exports.lastOf = (seq, index = 0) => seq[seq.length - 1 - index];

module.exports.lastIndex = (seq, index = 0) => seq.length - 1 - index;

// wrapper to give array.map an "or" method if empty
module.exports.backup = array => {
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
};
