import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun(features => features.gender.masculine),
    env: {},
  },
  {
    default: [letters.plain.consonant.t],
  }
);
