import {phonic, templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

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
