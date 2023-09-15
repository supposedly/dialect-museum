import {modify as lib} from "/lib/alphabet/library/transform";
import {templated} from "../../templated";

const library = lib(templated, `verb`, x => ({
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

const man = templated.modify.verb(({features, traits}) => ({
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
