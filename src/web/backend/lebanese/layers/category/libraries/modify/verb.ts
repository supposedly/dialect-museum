import {modify as lib} from "/lib/transform";
import {category} from "../../category";

const library = lib(category, `verb`, x => ({
  conjugation: {
    prefix: {
      left: ({subject: pronoun}) => x({pronoun}),
    },
    suffix: {
      right: ({subject: pronoun}) => x({pronoun}),
    },
    circumfix: {
      left: ({subject: pronoun}) => x({pronoun}),
      right: ({subject: pronoun}) => x({pronoun}),
    },
  },
}));

category.modify.verb(({features, traits}) => ({
  conjugation: {
    suffix: {
      from: features.tam.past,
      into: [library.conjugation.suffix],
    },
    prefix: {
      from: traits.nonpast,
      into: [library.conjugation.circumfix],
    },
  },
}));
