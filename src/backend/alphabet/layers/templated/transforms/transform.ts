import {underlying} from "../../underlying/underlying";
import {templated} from "../templated";

templated.transform.pronoun(features => ({
  masculine: () => [features.gender.masculine],
  common: () => [features.gender.common],
}), library => library);

templated.transform.verb(() => ({
  prefix: {
    left: ({subject: pronoun}) => [{pronoun}],
  },
  suffix: {
    right: ({subject: pronoun}) => [{pronoun}],
  },
  circumfix: {
    left: ({subject: pronoun}) => [{pronoun}],
    right: ({subject: pronoun}) => [{pronoun}],
  },
}), library => library);

templated.promote.pronoun(underlying, {
  default: pronoun => [{pronoun}],
}, {});
