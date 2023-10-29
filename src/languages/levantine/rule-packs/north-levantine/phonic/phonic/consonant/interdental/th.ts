import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    spec: {features: {voiced: false}},
    env: {},
  },
  {
    stopped: [letters.plain.consonant.t],
    assibilated: [letters.plain.consonant.s],
  },
  {
    affected: {
      spec: {context: {affected: true}},
    },
  }
);
