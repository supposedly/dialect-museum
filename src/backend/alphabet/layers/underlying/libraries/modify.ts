import {underlying} from "../underlying";

const test = underlying.modify.pronoun(({features, traits, context}) => ({
  test: {
    test: {
      from: {match: `all`,
        value: [
          features.number.plural,
          {match: `any`,
            value: [features.gender.common, features.gender.feminine],
          },
          context.affected(true),
        ],
      },
      into: [() => [features.gender.common]],
    },
  },
}));
