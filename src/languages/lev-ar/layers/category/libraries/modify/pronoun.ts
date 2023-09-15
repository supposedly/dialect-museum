import {category} from "../../category";
import {modify as lib} from "/lib/transform";

const library = lib(category, `pronoun`, (_, features) => ({
  gender: {
    masculine: () => [features.gender.masculine],
    common: () => [features.gender.common],
  },
}));

export default category.modify.pronoun(({features}) => ({
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
