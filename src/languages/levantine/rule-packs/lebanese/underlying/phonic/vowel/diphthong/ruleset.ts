import {phonic, templates, underlying} from '/languages/levantine/alphabets';
import {letters} from '/languages/levantine/alphabets/underlying';
import {rulePack} from '/lib/rules';

export default rulePack(
  underlying,
  phonic,
  [templates],
  {
    spec: letters.plain.vowel.a,
    env: {
      next: [
        {
          spec: {
            match: `any`,
            value: [
              letters.plain.consonant.w,
              letters.plain.consonant.y,
            ],
          },
        },
      ],
    },
  }
);
