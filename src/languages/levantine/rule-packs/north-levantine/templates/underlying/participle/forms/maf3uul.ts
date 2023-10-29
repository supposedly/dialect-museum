import ruleset from '../ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

export default ruleset(
  {
    spec: ({participle}) => participle((features, traits) => ({
      match: `all`,
      value: [
        traits.mujarrad,
        features.voice.passive,
      ],
    })),
  },
  {
    default: ({features: {root: $}}) => [
      letters.plain.consonant.m,
      letters.plain.vowel.a,
      separateContext($[0], `affected`),
      separateContext($[1], `affected`),
      letters.plain.vowel.uu,
      separateContext($[2], `affected`),
    ],
  }
);
