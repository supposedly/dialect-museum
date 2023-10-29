import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => ({
      match: `all`,
      value: [
        features.door.fa3la2,
        traits.quadriliteral,
      ],
    })),
    env: {},
  },
  operations => ({
    default: ({features: {root: $, tam}}) => [
      operations.preject(
        separateContext($[0], `affected`),
        letters.plain.vowel.a,
      ),
      operations.mock(({verb}) => verb({
        door: `f3vl`,
        theme: tam === `past` ? `a` : `i`,
        root: [$[1], $[2], $[3]],
      })),
    ],
  })
);
