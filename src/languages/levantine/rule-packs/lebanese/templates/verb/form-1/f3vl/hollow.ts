import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

type Doubles<T extends string> = T extends unknown ? `${T}${T}` : never;

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.hollow),
    env: {},
  },
  {
    default: ({features: {root: [$F, _, $L], theme}}) => [
      separateContext($F, `affected`),
      letters.plain.vowel[(theme + theme) as Doubles<typeof theme>],
      separateContext($L, `affected`),
    ],
  }
);
