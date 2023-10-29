import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.gender.feminine),
    env: {},
  },
  operations => ({
    ak: [operations.preject(letters.plain.vowel.a)],
    k: [],
  }),
  {
    // this probably doesn't work
    afterVowel: {
      env: ({after}, {vowel}) => after(
        {
          match: `any`,
          value: [
            vowel(),
            [
              // diphthongs just in case there are any still uncoalesced
              {
                match: `any`,
                value: [
                  letters.plain.consonant.w,
                  letters.plain.consonant.y,
                ],
              },
              letters.plain.vowel.a,
            ],
          ],
        }
      ),
    },
  }
);
