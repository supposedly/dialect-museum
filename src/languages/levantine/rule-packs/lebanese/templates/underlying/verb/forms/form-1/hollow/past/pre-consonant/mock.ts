// this is for higher wazns to mock, it resolves theme === `a` to CaC- instead of CiC-

import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
    target: {},
    // was: {
    //   templates: {
    //     spec: ({verb}) => verb({door: {match: `any`, value: [`fta3vl`, `nfa3vl`, `staf3al`]}}),
    //   },
    // },
    was: {},
  },
  {
    default: ({features: {root: $, theme}}) => {
      return [
        separateContext($[0], `affected`),
        letters.plain.vowel[theme],
        separateContext($[2], `affected`),
      ];
    },
  }
);
