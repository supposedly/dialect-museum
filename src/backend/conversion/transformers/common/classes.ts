/* eslint-disable max-classes-per-file */
import {Function as Func, List} from 'ts-toolbelt';

import {Alphabet} from '../../alphabets/common';

import {OrderedObj, RevTail, KeysOf, ObjectOf, ShiftOne, OrderedObjOf, MergeObjs} from './type';

type InnerFuncType<A extends Alphabet, B extends Alphabet> = (capture: Capture<A, B>, abc: A, nextABC: B) => void;
type FuncType<A extends Alphabet, B extends Alphabet> = (func: InnerFuncType<A, B>) => void;

type _NextMappedFuncs<O extends OrderedObj, _o = ObjectOf<O>, _shifted = ObjectOf<ShiftOne<O>>> = {
  [K in List.UnionOf<RevTail<KeysOf<O>>>]: FuncType<
    _o[K] extends Alphabet ? _o[K] : never,
    _shifted[K] extends Alphabet ? _shifted[K] : never
  >
}
type NextMappedFuncs<O extends OrderedObj> = _NextMappedFuncs<O>;

export class Capture<A extends Alphabet, B extends Alphabet> {
  constructor(private readonly currentAlphabet: A, private readonly nextAlphabet: B) {}
}

export class Tracker {}

export class TrackerList {
  private head: Tracker;

  constructor() {
    this.head = new Tracker();
  }
}

// wanted to call this نَصّ
export class Document<A extends List.List<Record<string, NonNullable<Alphabet>>>> {
  public readonly alphabets: MergeObjs<Func.Narrow<A>>;
  private readonly orderedAlphabets: OrderedObjOf<Func.Narrow<A>>;
  public readonly select: NextMappedFuncs<typeof this.orderedAlphabets>;

  constructor(
    public readonly text: TrackerList,
    alphabets: Func.Narrow<A>,
  ) {
    this.alphabets = Object.assign({}, ...alphabets);
    this.orderedAlphabets = alphabets.map(o => Object.entries(o)[0]) as unknown as typeof this.orderedAlphabets;
    this.select = Object.fromEntries(this.orderedAlphabets.map(([name, alphabet], idx) => [
      name,
      // abc and nextABC's actual types from NextMappedFuncs are narrower
      (func: InnerFuncType<typeof alphabet, typeof alphabet | undefined>) => {
        const next = this.orderedAlphabets[idx + 1]?.[1];
        func(new Capture(alphabet, next), alphabet, next);
      }
    ]));
  }
}
