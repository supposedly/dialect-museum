import {phonic, templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

export default rulePack(
  underlying,
  phonic,
  [templates],
  {
    spec: {type: `vowel`},
    env: {},
  }
);
