import {templates} from "../../templates";
import {modify as lib} from "/lib/transform";

const library = lib(templates, `pronoun`, (_, features) => ({
  gender: {
    masculine: () => [features.gender.masculine],
    common: () => [features.gender.common],
  },
}));

export default templates.modify.pronoun(({features}) => ({
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
