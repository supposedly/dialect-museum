import type {Obj} from "./backend/conversion/objects/obj";
import type ObjType from "./backend/conversion/parsing/type";
import type {Segment} from "./backend/conversion/symbols";

export type Syllable = Obj<ObjType.syllable, Segment[]>;
export type Word = Obj<ObjType.word, Syllable[]>;
