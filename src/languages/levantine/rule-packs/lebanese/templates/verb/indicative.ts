import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({verb}) => verb(
      features => features.tam.indicative,
      context => context.affected(false)
    ),
    env: {},
  },
  operations => ({
    default: [operations.preject({type: `affix`, features: {symbol: `indicative`}, context: {affected: false}})],
  })
);
