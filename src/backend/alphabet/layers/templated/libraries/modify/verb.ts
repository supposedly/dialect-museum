import {modify as lib} from "../../../../library/transform";
import {templated} from "../../templated";

const library = lib(templated, `verb`, fix => ({
  conjugation: {
    prefix: {
      left: ({subject: pronoun}) => fix({pronoun}),
    },
    suffix: {
      right: ({subject: pronoun}) => fix({pronoun}),
    },
    circumfix: {
      left: ({subject: pronoun}) => fix({pronoun}),
      right: ({subject: pronoun}) => fix({pronoun}),
    },
  },
}));

templated.modify.verb(({features, traits}) => ({
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
