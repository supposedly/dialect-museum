import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';
import {Merge} from '/lib/utils/typetools';

export default ruleset(
  {
    spec: {features: {voiced: true, emphatic: true}},
    env: {},
  },
  {
    stopped: [letters.plain.consonant.d],
    assibilated: [letters.plain.consonant.z],
  },
  {
    affected: {
      spec: {context: {affected: true}},
    },
  }
);
