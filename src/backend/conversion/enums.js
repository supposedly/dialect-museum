// "fake enum"
// takes an array of symbols and returns an object of [symbol, index]
function fenum(arr) {
  const o = Object.fromEntries(arr.map((e, i) => [e, i]));
  o.keys = arr;
  return o;
}

module.exports = {
  fenum,
};
