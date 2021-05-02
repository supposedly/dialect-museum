const obj = require(`../objects`);

module.exports = {
  lastOf: (seq, index = 0) => seq[seq.length - 1 - index],
  copy: arr => [...arr],
  invMap(arrayOfFuncs) {
    const invMapper = (...args) => arrayOfFuncs.map(f => f(...args));
    invMapper.or = arrayOfFuncs.length
      ? backup => (..._) => [backup]
      : _ => invMapper;
    return invMapper;
  },
  newSyllable: (string = []) => obj.obj(
    `syllable`,
    { stressed: null, weight: null },
    string
  )
};
