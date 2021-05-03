const obj = require(`../objects`);

module.exports = {
  lastOf: (seq, index = 0) => seq[seq.length - 1 - index],
  lastIndex: (seq, index = 0) => seq.length - 1 - index,
  copy: o => (Array.isArray(o) ? [...o] : { ...o }),
  backup(array) {  // wrapper to give array.map an "or" method if empty
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
  },
  invMap(arrayOfFuncs) {
    const invMapper = (...args) => arrayOfFuncs.map(f => f(...args));
    invMapper.or = arrayOfFuncs.length
      ? _ => invMapper
      : backup => (...args) => [backup(...args)];
    return invMapper;
  },
  newSyllable: (string = []) => obj.obj(
    `syllable`,
    { stressed: null, weight: null },
    string
  )
};
