import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({person: `second`}),
    env: {},
  },
  operations => ({
    // fs2: [operations.mock.was.templates({type: `verb`})],  // oof
    fs2: [operations.mock(letters.plain.consonant.t, letters.plain.vowel.ii)],
    normal: [operations.mock({features: {person: `third`}})],
  })
);
