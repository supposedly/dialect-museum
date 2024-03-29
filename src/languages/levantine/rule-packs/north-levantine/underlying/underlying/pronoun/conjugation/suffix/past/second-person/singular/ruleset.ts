import {rulePack} from 'src/lib/rules';

import {underlying, templates} from 'src/languages/levantine/alphabets';

export default rulePack(
  underlying,
  underlying,
  [templates],
  {
    spec: {type: `pronoun`, features: {person: `second`, number: `singular`}},
    was: {
      templates: {
        spec: ({verb}) => verb(features => features.tam.past),
      },
    },
    env: ({before}, {boundary, delimiter}) => (
      before({
        match: `any`,
        value: [
          boundary((features, traits) => traits.suprasyllabic),
          delimiter(),
        ],
      })
    ),
  }
);
