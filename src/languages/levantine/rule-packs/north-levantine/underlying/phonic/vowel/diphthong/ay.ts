import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: ({before}, {consonant}) => before(consonant(letters.plain.consonant.y.features)),
  },
  operations => ({
    // second is not used but FIXME why is consonant() making it y | {}
    vocalic: ({features: first}, {next: {0: {spec: {features: second}}}}) => [
      operations.coalesce(
        {
          type: `diphthong`,
          features: {
            first: {...first, tense: false, color: null, stressed: false},
            second: {...letters.plain.vowel.i.features, tense: true, color: null, stressed: false},
          },
        }
      ),
    ],
    // this probably won't actually be used but as it stands it thwarts default
    consonantal: capture => [operations.mock(capture)],
  })
);
