import ruleset from './base';
import {letters} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.number.singular),
    env: {},
  },
  {
    default: [letters.plain.consonant.t],
  }
);
