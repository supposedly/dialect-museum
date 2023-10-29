import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/underlying';
import {separateContext} from '/lib/rules';

type Doubles<T extends string> = T extends unknown ? `${T}${T}` : never;

export default ruleset(
  {
    spec: ({verb}) => verb((features, traits) => traits.defective),
    env: {},
  },
  {
    default: ({features: {root, theme}}) => {
      return [
        separateContext(root[0], `affected`),
        separateContext(root[1], `affected`),
        letters.plain.vowel[(theme + theme) as Doubles<typeof theme>],
      ];
    },
  }
);
