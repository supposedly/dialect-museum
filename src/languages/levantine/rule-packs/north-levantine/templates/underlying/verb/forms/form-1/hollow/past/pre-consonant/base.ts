import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
    target: {},
    was: {
      templates: {
        spec: ({verb}) => verb({door: {match: `any`, value: [`fa3al`, `fa3il`, `f3vl`]}}),
      },
    },
  },
  {
    default: ({features: {root: $, theme}}) => {
      return [
        separateContext($[0], `affected`),
        letters.plain.vowel[theme === `a` ? `i` : theme],
        separateContext($[2], `affected`),
      ];
    },
  }
);
