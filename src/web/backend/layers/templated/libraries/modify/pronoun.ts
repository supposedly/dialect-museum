import {templated} from "../../templated";
import {modify as lib} from "/lib/alphabet/library/transform";

const library = lib(templated, `pronoun`, (_, features) => ({
  gender: {
    masculine: () => [features.gender.masculine],
    common: () => [features.gender.common],
  },
}));

export default templated.modify.pronoun(({features}) => ({
  gender: {
    genderNeutralPlural: {
      from: features.number.plural,
      into: [library.gender.common],
    },
    masculineAsNeutral: {
      from: features.gender.common,
      into: [library.gender.masculine],
    },
  },
}));
