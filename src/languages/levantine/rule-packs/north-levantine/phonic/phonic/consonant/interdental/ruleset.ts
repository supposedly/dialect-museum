import {phonic, templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  phonic,
  phonic,
  [templates, underlying],
  {
    spec: ({consonant}) => consonant({
      location: `teeth`,
      manner: `fricative`,
      articulator: `tongue`,
    }),
    env: {},
  },
);
