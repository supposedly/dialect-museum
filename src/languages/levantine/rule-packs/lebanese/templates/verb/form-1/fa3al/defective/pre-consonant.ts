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
    ending: {
      ay: ({features: {root}}) => {
        const [$F, $3] = root.map(r => separateContext(r, `affected`));
        return [
          $F,
          letters.plain.vowel.a,
          $3,
          letters.plain.vowel.a,
          letters.plain.consonant.y,
        ];
      },
    },
  }
);
