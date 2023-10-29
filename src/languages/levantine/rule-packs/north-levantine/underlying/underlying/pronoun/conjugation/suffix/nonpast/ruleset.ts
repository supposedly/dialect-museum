import {rulePack} from 'src/lib/rules';

import {underlying, templates} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`},
    was: {
      templates: {
        spec: ({verb}) => verb((features, traits) => traits.nonpast),
      },
    },
    env: ({before}, {boundary, delimiter}) => (
      before({
        match: `any`,
        value: [
          boundary(),
          delimiter(),
        ],
      })
    ),
  }
);
