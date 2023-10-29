import ruleset from '../../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({special}) => special({shape: `af3al`}),
    env: {},
  },
  operations => ({
    af3al: ({features: {root: {length}}}) => [
      operations.preject(
        letters.plain.consonant.$,
        letters.plain.vowel.a,
      ),
      operations.mock({
        type: `verb`,
        features: {
          door: length === 3 ? `f3vl` : `fa3la2`,
          theme: `a`,
          tam: `past`,
        },
      }),
    ],
    af3il: ({features: {root: {length}}}) => [
      operations.preject(
        letters.plain.consonant.$,
        letters.plain.vowel.a,
      ),
      operations.mock({
        type: `verb`,
        features: {
          door: length === 3 ? `f3vl` : `fa3la2`,
          theme: `i`,
          tam: `subjunctive`,
        },
      }),
    ],
  })
);
