const {af3al} = require(`./af3al`);
const {augmentation} = require(`./augmentation`);
const {idafe} = require(`./idafe`);
const {pp} = require(`./pp`);
const {pronoun} = require(`./pronoun`);
const {tif3il} = require(`./tif3il`);
const {verb} = require(`./verb`);
const {word} = require(`./word`);

const {types} = require(`..`);

module.exports = {
  [types.af3al]: af3al,
  [types.augmentation]: augmentation,
  [types.idafe]: idafe,
  [types.pp]: pp,
  [types.pronoun]: pronoun,
  [types.tif3il]: tif3il,
  [types.verb]: verb,
  [types.word]: word,
};
