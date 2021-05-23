const {af3al} = require(`./af3al`);
const {augmentation} = require(`./augmentation`);
const {idafe} = require(`./idafe`);
const {pp} = require(`./pp`);
const {pronoun} = require(`./pronoun`);
const {tif3il} = require(`./tif3il`);
const {verb} = require(`./verb`);
const {word} = require(`./word`);

const {type} = require(`../type`);

module.exports = {
  [type.af3al]: af3al,
  [type.augmentation]: augmentation,
  [type.idafe]: idafe,
  [type.pp]: pp,
  [type.pronoun]: pronoun,
  [type.tif3il]: tif3il,
  [type.verb]: verb,
  [type.word]: word,
};
