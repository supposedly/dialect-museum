import {phonic, templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  phonic,
  phonic,
  [templates, underlying],
  {
    spec: {type: `vowel`},
    env: ({before}, {boundary}) => (
      before(boundary((features, traits) => traits.suprasyllabic))
    ),
  }
);
