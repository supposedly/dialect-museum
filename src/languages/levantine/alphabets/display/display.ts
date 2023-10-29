import {alphabet} from 'src/lib/alphabet';

export default alphabet({
  name: `display`,
  context: {
    capitalized: {match: `type`, value: `boolean`},
  },
  types: {
    literal: {
      value: {match: `type`, value: `string`},
    },
  },
}, {});
