import {phonic, templates, underlying, display} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  phonic,
  display,
  [templates, underlying],
  {spec: {}, env: {}},
);
