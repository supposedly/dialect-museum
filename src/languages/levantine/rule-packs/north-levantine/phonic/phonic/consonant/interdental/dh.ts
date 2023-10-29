import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

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
