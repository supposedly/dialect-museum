import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: ({before}, {consonant}) => before(consonant(letters.plain.consonant.y.features)),
  },
  operations => ({
    // second is not used but FIXME why is consonant() making it y | {}
    default: ({features: first}, {next: {0: {spec: {features: second}}}}) => [
      operations.coalesce(
        {
          type: `diphthong`,
          features: {
            first: {...first, tense: false, color: null},
            second: {...letters.plain.vowel.i.features, tense: true, color: null},
          },
        }
      ),
    ],
  })
);
