import ruleset from'./ruleset';
import {underlying} from '/languages/levantine/alphabets';

export default ruleset(
  {
    spec: {features: {subject: underlying.types.pronoun}, context: {affected: {match: `type`, value: `boolean`}}},
    env: {},
  },
  operations => ({
    default: ({features: {subject}, context}) => [
      operations.postject(({pronoun}) => pronoun(subject, context)),
    ],
  })
);
