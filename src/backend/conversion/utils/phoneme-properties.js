const withInv = arr => {
  arr.inv = Object.fromEntries(arr.map((e, i) => [i, e]));
};

// alternatively: [dip, hip, strip, tip, lip]
module.exports.articulators = withInv([`throat`, `root`, `mid`, `crown`, `lips`]);

module.exports.manners = withInv([`plosive`, `fricative`, `affricate`, `approximant`, `nasal`, `flap`]);
