import ruleset from './ruleset';
import {templates} from 'src/languages/levantine/alphabets';

export default ruleset(
  {
    spec: {type: `word`, features: templates.types.word},
    env: {},
  },
  {
    default: ({features: {string}}) => string as ReadonlyArray<typeof string[number]>,
  }
);
