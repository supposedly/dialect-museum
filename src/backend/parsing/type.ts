import {type CategorizedSymbol} from "../alphabets/basic-symbols";
import {type ValuesOf} from "../utils/typetools";

export type SymbolWrapper = ValuesOf<{
  [K in keyof CategorizedSymbol]: {
    type: K
    meta: (K extends `consonant` ? {
          emphatic: boolean,
        } : never)
    value: CategorizedSymbol[K]
  }
}>;
