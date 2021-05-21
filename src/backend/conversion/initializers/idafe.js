const {lastOf} = require(`../utils/misc`);

// TODO: numbers
function toConstruct(word) {
  if (word.type === `idafeChain`) {  // this shouldn't ever trigger but ykno...
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
  if (possessor.type === `chain`) {
    return {
      type: `chain`,
      meta: {...possessor.meta},
      value: [...possessee, ...possessor.value],
    };
  }
  return {
    type: `chain`,
    meta: {},
    value: [...possessee, possessor],
  };
}

module.exports = {
  idafe,
};
