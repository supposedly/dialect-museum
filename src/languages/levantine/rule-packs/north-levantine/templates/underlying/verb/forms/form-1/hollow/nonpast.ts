import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';
import {separateContext} from 'src/lib/rules';

type Doubles<T extends string> = T extends unknown ? `${T}${T}` : never;


export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.nonpast),
    env: {},
  },
  {
    default: ({features: {root: $, theme}}) => [
      separateContext($[0], `affected`),
      letters.plain.vowel[(theme + theme) as Doubles<typeof theme>],
      separateContext($[2], `affected`),
    ],
  }
);
