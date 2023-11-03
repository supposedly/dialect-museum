import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb(
      features => features.tam.indicative,
      context => context.affected(false)
    ),
    env: {},
  },
  operations => ({
    indicative: [operations.preject(letters.plain.affix.indicative)],
  })
);
