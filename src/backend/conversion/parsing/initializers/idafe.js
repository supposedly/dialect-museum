import { type } from '../type';
/* const {misc: {lastOf}} = require(`../../utils`);
const {obj} = require(`../../objects`); */

/*
function toConstruct(word) {
  if (word.type === type.idafe) {  // this shouldn't ever trigger but ykno...
    toConstruct(lastOf(word.value));
  } else {
    const lastSyllable = lastOf(word.value).value;
    const lastSegment = lastOf(lastSyllable);
    if (lastSegment.value === `fem` && !lastSegment.meta.t) {
      // technically since verbs are already t === true this makes
      // it okay not to check for verbs vs. nonverbs here
      lastSyllable.splice(-1, obj.edit(lastSegment, {meta: {t: true}}));
    }
  }
  // mutates but also returns for convenience
  return word;
}
*/

export default function idafe({
  possessor,
  possessee,
}) {
  /* possessee = Array.isArray(possessee)
    ? possessee.map(toConstruct)
    : [toConstruct(possessee)]; */
  possessee = Array.isArray(possessee) ? possessee : [possessee];
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
