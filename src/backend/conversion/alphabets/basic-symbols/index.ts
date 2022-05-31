import {MergeUnion, ValuesOf} from "../../utils/typetools";
import * as basic from "./basic-symbols";

export {basic};
export type Symbol = `${
  | keyof MergeUnion<Exclude<ValuesOf<typeof basic>, any[]>>
  | Extract<ValuesOf<typeof basic>, any[]>[number]
}`;
