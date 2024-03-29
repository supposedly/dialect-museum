import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: ({before}, {consonant}) => before(consonant(letters.plain.consonant.w.features)),
  },
  operations => ({
    vocalic: ({features: first}) => [
      operations.coalesce(
        {
          type: `diphthong`,
          features: {
            first: {...first, tense: false, color: null, stressed: null},
            second: {...letters.plain.vowel.u.features, tense: true, color: null, stressed: null},
          },
        }
      ),
    ],
    // this probably won't actually be used but as it stands it thwarts default
    // (it's for bqaa3i tnaaaayn dialects)
    consonantal: capture => [operations.mock(capture)],
  })
);
