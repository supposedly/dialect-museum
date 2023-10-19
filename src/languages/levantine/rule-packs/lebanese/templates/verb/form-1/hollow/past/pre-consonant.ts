import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

export default ruleset(
  {
    spec: {},
    env: {
      target: {
        env: ({before}, {consonant}) => before(consonant()),
      },
    },
  },
  {
    default: ({features: {root, theme}}) => {
      const [$F, _, $L] = root.map(r => separateContext(r, `affected`));
      return [
        $F,
        letters.plain.vowel[theme],
        $L,
      ];
    },
  }
);
