import {phonic, templates, underlying} from '/languages/levantine/alphabets';
import {rulePack} from '/lib/rules';

export default rulePack(
  phonic,
  phonic,
  [templates, underlying],
  {
    // {type: {match: `any`, value: [`vowel`, `diphthong`]}} errored lol
    spec: {
      match: `any`,
      value: [
        {type: `vowel`},
        {type: `diphthong`},
      ],
    },
    env: {},
  }
);
