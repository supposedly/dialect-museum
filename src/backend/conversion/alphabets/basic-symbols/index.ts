import {MergeUnion, ValuesOf} from "../../utils/typetools";
import * as basic from "./basic-symbols";

export {basic};
export type AlphabetSymbol = `${
  | keyof MergeUnion<Exclude<ValuesOf<typeof basic>, any[]>>
  | Extract<ValuesOf<typeof basic>, any[]>[number]
}`;
export type CategorizedSymbol = {
  consonant: `${keyof typeof basic[`consonants`]}`
  vowel: keyof typeof basic[`vowels`]
  pronoun: typeof basic[`pronouns`][number]
  delimiter: keyof typeof basic[`delimiters`]
};
