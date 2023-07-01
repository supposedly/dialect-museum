import {MergeUnion, ValuesOf} from "../../utils/typetools";
import * as basic from "./basic-symbols";

export * from "./basic-symbols";

export type AlphabetSymbol = `${
  | keyof MergeUnion<Exclude<ValuesOf<typeof basic>, any[]>>
  | Extract<ValuesOf<typeof basic>, any[]>[number]
}`;
export type CategorizedSymbol = {
  consonant: `${keyof typeof basic[`consonant`]}`
  vowel: keyof typeof basic[`vowel`]
  pronoun: typeof basic[`pronoun`][number]
  delimiter: keyof typeof basic[`delimiter`]
};
