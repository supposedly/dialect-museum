import {phonic, templates, underlying, display} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

export default rulePack(
  phonic,
  display,
  [templates, underlying],
  {spec: {type: `vowel`}, env: {}},
);
