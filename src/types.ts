import type {Obj} from "./backend/conversion/objects/obj";
import type objType from "./backend/conversion/parsing/type";
import type {Segment} from "./backend/conversion/symbols";

export type Syllable = Obj<objType.syllable, Segment[]>;
export type Word = Obj<objType.word, Syllable[]>;
