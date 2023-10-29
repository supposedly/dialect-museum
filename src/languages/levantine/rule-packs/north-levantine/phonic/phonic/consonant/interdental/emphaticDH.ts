import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';
import {Merge} from 'src/lib/utils/typetools';

function emphatic<
  const C extends {features: {emphatic: boolean}}
>(consonant: C): Merge<C, {features: {emphatic: true}}> {
  return {...consonant, features: {...consonant.features, emphatic: true}} as never;
}

export default ruleset(
  {
    spec: {features: {voiced: true, emphatic: true}},
    env: {},
  },
  {
    stopped: [emphatic(letters.plain.consonant.d)],
    assibilated: [emphatic(letters.plain.consonant.z)],
  },
  {
    affected: {
      spec: {context: {affected: true}},
    },
    wasDhaa: {
      was: {underlying: {spec: {features: {manner: `fricative`}}}},
    },
    wasDaad: {
      was: {underlying: {spec: {features: {manner: `stop`}}}},
    },
  }
);
