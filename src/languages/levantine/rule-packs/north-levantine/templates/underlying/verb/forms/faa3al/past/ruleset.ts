import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: ({verb}) => verb({
      door: `faa3al`,
      tam: `past`,
    }),
    env: {},
  }
);
