const {misc: {lastOf}} = require(`../../utils`);
const {type} = require(`../type`);

// TODO: numbers
function toConstruct(word) {
  if (word.type === type.idafe) {  // this shouldn't ever trigger but ykno...
    toConstruct(lastOf(word.value));
  }
  const lastSegment = lastOf(lastOf(word.value).value);
  if (lastSegment.value === `fem`) {
    // technically since verbs are already t === true this makes
    // it okay not to check for verbs vs. nonverbs here
    lastSegment.meta.t = true;
  }
  // mutates but also returns for convenience
  return word;
}

function idafe({
  possessor,
  possessee,
}) {
  possessee = Array.isArray(possessee) ? possessee.map(toConstruct) : [toConstruct(possessee)];
  if (possessor.type === type.idafe) {
    return {
      type: type.idafe,
      meta: {...possessor.meta},
      value: [...possessee, ...possessor.value],
    };
  }
  return {
    type: type.idafe,
    meta: {},
    value: [...possessee, possessor],
  };
}

module.exports = {
  idafe,
};
