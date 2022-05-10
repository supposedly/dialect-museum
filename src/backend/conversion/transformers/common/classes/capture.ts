/* eslint-disable max-classes-per-file */

import {Any, Function as Func, List, Union} from 'ts-toolbelt';

import * as ABC from '../../../alphabets/common';
import {OrderedObj, RevTail, KeysOf, ObjectOf, ShiftOne, OrderedObjOf, MergeObjs, TransformType} from '../type';

import {Match} from '../match';

type $<T> = Func.Narrow<T>;
type ValuesOf<O> = O[keyof O];
type ValuesOfABC<A extends ABC.AnyAlphabet> = ValuesOf<ABC.ABC<A>>;

type InnerCaptureFunc<
  Curr extends ABC.AnyAlphabet,
  Next extends ABC.AnyAlphabet,
> = (
    capture:
      ((obj: ValuesOf<ABC.ABC<Curr>>) => CaptureApplier<Curr, Next>) &
      {
        [K in ABC.Types<Curr>]: (
          obj: DeepMatchOr<DeepMerge<Extract<ValuesOf<ABC.ABC<Curr>>, {type: K}>>>
        ) => CaptureApplier<Curr, Next>
      }
    ,
    abc: ABC.ABC<Curr>,
    nextABC: ABC.ABC<Next>
) => void;

type CaptureFunc<
  Curr extends ABC.AnyAlphabet,
  Next extends ABC.AnyAlphabet,
> = (funcs: Record<string, InnerCaptureFunc<Curr, Next>>) => void;

type _NextMappedFuncs<O extends OrderedObj, _O = ObjectOf<O>, _Shifted = ObjectOf<ShiftOne<O>>> = {
  [K in List.UnionOf<RevTail<KeysOf<O>>>]: CaptureFunc<
    _O[K] extends ABC.AnyAlphabet ? _O[K] : never,
    _Shifted[K] extends ABC.AnyAlphabet ? _Shifted[K] : never
  >;
};
type NextMappedFuncs<O extends OrderedObj> = _NextMappedFuncs<O>;

type RawAlphabets = Record<string, NonNullable<ABC.AnyAlphabet>>;
type Alphabets = List.List<RawAlphabets>;
type FirstABC<A extends Alphabets> = OrderedObjOf<Func.Narrow<A>>[0][1];
type InputText<A extends Alphabets> = FirstABC<A>[keyof FirstABC<A>][];

type DeepPartial<O> = /* distribute union */ O extends any ? {
  [K in keyof O]?:
    O[K] extends Record<Any.Key, unknown>
      ? DeepPartial<O[K]>
      : O[K]
} : never;

type DeepMatchOr<O> = Match<O> | {
  [K in keyof O]?:
    O[K] extends Record<Any.Key, unknown>
      ? DeepMatchOr<O[K]>
      : Match<O[K]> | O[K]
};

// Same as Union.Merge<> but recursive
type DeepMerge<O> = [O] extends [object] ? {
  // I think the Union.Merge<O> helps it not distribute or something? not sure exactly what's
  // going on but it doesn't work without it if O is a union :(
  // Now with that settled it does work if you do:
  //  [K in keyof Union.Merge<O>]: DeepMerge<Union.Merge<O>[K]>
  // but in the interest of not duplicating that Union.Merge<O> you might want to try:
  //  ~~[K in keyof Union.Merge<O>]: DeepMerge<O[K]>~~
  // which SHOULD be the same -- but TypeScript ofc doesn't love it unless you go
  //  [K in keyof Union.Merge<O>]: K extends keyof O ? DeepMerge<O[K]> : never
  // so in the double-interest of not having that conditional, this `&` is my best solution
  [K in keyof Union.Merge<O> & keyof O]: DeepMerge<O[K]>
} : O;

type MatchSpec<A extends ABC.AnyAlphabet> = DeepPartial<ValuesOf<{
  [K in ABC.Types<A>]: DeepMerge<Extract<ValuesOf<ABC.ABC<A>>, {type: K}>>
}>>;

// todo: replace `string` with a union of specific accent features from somewhere or other
type IntoSpec<B extends ABC.AnyAlphabet> = Record<string, ValuesOfABC<B> | ValuesOfABC<B>[]>;

type Rule<A extends ABC.AnyAlphabet, B extends ABC.AnyAlphabet> = {
  type: TransformType,
  into: IntoSpec<B>,
  where: MatchSpec<A>
};

class CaptureApplier<A extends ABC.AnyAlphabet, B extends ABC.AnyAlphabet> {
  constructor(
    private rules: Rule<A, B>[],
    private layer: string,
    private obj: Partial<A[keyof A]>,
    private feature: string,
  ) {}

  transform({into, where}: {into: IntoSpec<B>, where: MatchSpec<A>}) {
    this.rules.push({
      type: TransformType.transformation,
      into,
      where,
    });
  }

  promote({into, where}: {into: IntoSpec<B>, where: MatchSpec<A>}) {
    this.rules.push({
      type: TransformType.promotion,
      into,
      where,
    });
  }
}

export class Language<A extends Alphabets> {
  public readonly abcNames: OrderedObjOf<A>;
  public rules: {
    [K in List.UnionOf<KeysOf<typeof this.abcNames>>]: Rule<
      ObjectOf<typeof this.abcNames>[K],
      ObjectOf<typeof this.abcNames>[K]
  >[]};

  public readonly abcs: MergeObjs<A>;
  public readonly select: NextMappedFuncs<typeof this.abcNames>;

  constructor(...abcs: $<A>) {
    this.abcs = Object.assign({}, ...abcs);
    this.abcNames = abcs.map(o => Object.entries(o)[0]) as unknown as typeof this.abcNames;
    this.rules = Object.fromEntries(this.abcNames.map(name => [name, []]));

    this.select = Object.fromEntries(
      this.abcNames.map(([layer, alphabet], idx) => [
        layer,
        (
          // the actual alphabet types from NextMappedFuncs are narrower
          funcs: Record<string, InnerCaptureFunc<typeof alphabet, typeof alphabet>>,
        ) => {
          const next = this.abcNames[idx + 1]?.[1];
          Object.entries(funcs).forEach(([feature, func]) => {
            const f = Object.assign(
              (
                obj: Partial<unknown>, // Partial<typeof alphabet[keyof typeof alphabet]>,
              ) => new CaptureApplier<any, any>(
                this.rules[layer as keyof typeof this.rules],
                layer, obj, feature,
              ),
              Object.fromEntries(alphabet.__types.forEach((type: string) => [
                type,
                (obj: Partial<typeof alphabet[keyof typeof alphabet]>) => new CaptureApplier<any, any>(
                  this.rules[layer as keyof typeof this.rules],
                  layer, obj, feature,
                ),
              ])),
            );
            func(f, alphabet, next);
          });
        },
      ]),
    );
  }

  applyTo(text: InputText<A>): InputText<A> {
    return this && text;
  }
}

export default Language;  // get linter to be quiet for now
