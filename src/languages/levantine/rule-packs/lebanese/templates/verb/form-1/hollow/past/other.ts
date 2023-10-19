import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    default: ({features: {root}}) => {
      const [$F, _, $L] = root.map(r => separateContext(r, `affected`));
      return [
        $F,
        letters.plain.vowel.aa,
        $L,
      ];
    },
  }
);
