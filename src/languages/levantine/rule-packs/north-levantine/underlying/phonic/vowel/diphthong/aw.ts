import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: ({before}, {consonant}) => before(consonant(letters.plain.consonant.w.features)),
  },
  operations => ({
    // second is not used but FIXME why is consonant() making it w | {}
    vocalic: ({features: first}, {next: [{spec: {features: second}}]}) => [
      operations.coalesce(
        {
          type: `diphthong`,
          features: {
            first: {...first, tense: false, color: null, stressed: false},
            second: {...letters.plain.vowel.u.features, tense: true, color: null, stressed: false},
          },
        }
      ),
    ],
    // this probably won't actually be used but as it stands it thwarts default
    consonantal: capture => [operations.mock(capture)],
  })
);
