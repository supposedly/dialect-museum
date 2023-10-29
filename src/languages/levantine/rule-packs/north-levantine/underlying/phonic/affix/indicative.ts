import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    // FIXME nah undo the thing where you have to omit the key (i want to write affix({symbol: `indicative`}))
    spec: ({affix}) => affix(`indicative`),
    env: {},
  },
  operations => ({
    b: [operations.mock(letters.plain.consonant.b)],
    m: [operations.mock(letters.plain.consonant.m)],
  }),
  {
    beforeNasalPrefix: {
      env: ({before}, {consonant}) => (
        before(
          {
            spec: consonant({nasal: true}),
            // FIXME this should typecheck
            // (...maybe it's by design since i had to make before() not be slow rip)
            was: {underlying: {spec: {type: `pronoun`}}},
          },
          // FIXME oof the AddSpec thing is bad
          {spec: {}, was: {templates: {spec: {type: `verb`}}}},
        )
      ),
    },
  }
);
