/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import {Any, Function as Func, List, Union} from 'ts-toolbelt';

import * as ABC from '../../../alphabets/common';
import {
  OrderedObj,
  RevTail,
  ObjectOf,
  ShiftOne,
  OrderedObjOf,
  MergeObjs,
  TransformType,
  ShiftedObjOf,
  KeysAndIndicesOf,
} from '../type';
import {Match} from '../match';

type $<T> = Func.Narrow<T>;
type ValuesOf<O> = O[keyof O];

type InnerCaptureFunc<
  Curr extends ABC.AnyAlphabet,
  Next extends ABC.AnyAlphabet,
  PreCurr extends OrderedObj<string, ABC.AnyAlphabet>,
> = (
  capture:
    ((obj: ABC.ValuesOfABC<Curr>) => CaptureApplier<Curr, Next, PreCurr>) &
    {
      [T in ABC.Types<Curr>]: (
        obj: DeepMatchOr<DeepMerge<ABC.AllOfType<Curr, T>>>
      ) => CaptureApplier<Curr, Next, PreCurr>
    }
  ,
  abc: ABC.ABC<Curr>,
  nextABC: ABC.ABC<Next>
) => void;

type CaptureFunc<
  Curr extends ABC.AnyAlphabet,
  Next extends ABC.AnyAlphabet,
  PreCurr extends OrderedObj<string, ABC.AnyAlphabet>,
> = (funcs: Record<string, InnerCaptureFunc<Curr, Next, PreCurr>>) => void;

type _NextMappedFuncs<O extends OrderedObj<string, ABC.AnyAlphabet>, _O = ObjectOf<O>, _Shifted = ObjectOf<ShiftOne<O>>> = {
  [KI in List.UnionOf<RevTail<KeysAndIndicesOf<O>>> as KI[0]]: CaptureFunc<
    _O[KI[0]] extends ABC.AnyAlphabet ? _O[KI[0]] : never,
    _Shifted[KI[0]] extends ABC.AnyAlphabet ? _Shifted[KI[0]] : never,
    RevTail<List.Extract<O, 0, KI[1]>>
  >;
};
type NextMappedFuncs<O extends OrderedObj<string, ABC.AnyAlphabet>> = _NextMappedFuncs<O>;

type RawAlphabets = Record<string, NonNullable<ABC.AnyAlphabet>>;
type Alphabets = List.List<RawAlphabets>;
type FirstABC<A extends Alphabets> = OrderedObjOf<Func.Narrow<A>>[0][1];
type InputText<A extends Alphabets> = FirstABC<A>[keyof FirstABC<A>][];

type DeepMatchOr<O> = Match<DeepMatchOr<O>> | {
  [K in keyof O]?:
    O[K] extends Record<Any.Key, unknown>
      ? DeepMatchOr<O[K]>
      : Match<O[K]> | O[K]
};

// Same as Union.Merge<> but recursive
type DeepMerge<O> = [O] extends [object] ? {
  // I think the Union.Merge<O> helps it not distribute or something? Not sure exactly what's
  // going on but it doesn't work without it if O is a union :(
  [K in keyof Union.Merge<O> & keyof O]: DeepMerge<O[K]>
  // Now with that settled it does work if you just do:
  //  [K in keyof Union.Merge<O>]: DeepMerge<Union.Merge<O>[K]>
  // but in the interest of not duplicating that Union.Merge<O>, you might want to try:
  //  * [K in keyof Union.Merge<O>]: DeepMerge<O[K]>
  // which SHOULD be the same -- but TypeScript ofc doesn't love it unless you go
  //  [K in keyof Union.Merge<O>]: K extends keyof O ? DeepMerge<O[K]> : never
  // so in the double-interest of not having that conditional, that `&` is my best solution
} : O;

// TODO: figure out how to handle `{was: ...}`
type MatchSpec<A extends ABC.AnyAlphabet, Pre extends OrderedObj<string, ABC.AnyAlphabet>> = DeepMatchOr<Union.Merge<
  | ValuesOf<{
    [Dir in `next` | `prev`]: {
      [T in ABC.Types<A> as `${Dir}${Capitalize<T>}`]: {  // Adding ` // to help GitHub's syntax-highlighting bc bugged
          val: DeepMerge<ABC.AllOfType<A, T>>
          env: MatchSpec<A, Pre>
        }
      }
  }>
  | {
    [Dir in `next` | `prev`]: {
      val: ValuesOf<{[T in ABC.Types<A>]: DeepMerge<ABC.AllOfType<A, T>>}>
      env: MatchSpec<A, Pre>
    }
  }
  | {
    was: {
      // Pre[KI[1]][1] is like `value of Pre at index I` and it's the AnyAlphabet at some layer
      [KI in List.UnionOf<KeysAndIndicesOf<Pre>> as KI[0]]: /* {val: */ ValuesOf<{
          [T in ABC.Types<Pre[KI[1]][1]>]: DeepMerge<ABC.AllOfType<Pre[KI[1]][1], T>>
        }>
        // env: MatchSpec<Pre[KI[1]][1], List.Extract<Pre, 0, KI[0]>>
        // ^ doesn't work bc type instantiation is excessively deep
    }
  }
>>;

// TODO: replace `string` with a union of specific accent features from somewhere or other
type IntoSpec<B extends ABC.AnyAlphabet> = Record<string, ABC.ValuesOfABC<B> | ABC.ValuesOfABC<B>[]>;

type Rule<A extends ABC.AnyAlphabet, B extends ABC.AnyAlphabet, PreA extends OrderedObj<string, ABC.AnyAlphabet>> = {
  type: TransformType,
  into: IntoSpec<B>,
  where: MatchSpec<A, PreA>
};

class CaptureApplier<A extends ABC.AnyAlphabet, B extends ABC.AnyAlphabet, PreA extends OrderedObj<string, ABC.AnyAlphabet>> {
  constructor(
    private rules: Rule<A, B, PreA>[],
    private layer: string,
    private obj: Partial<A[keyof A]>,
    private feature: string,
  ) {}

  transform({into, where}: {into: IntoSpec<B>, where: MatchSpec<A, PreA>}) {
    this.rules.push({
      type: TransformType.transformation,
      into,
      where,
    });
  }

  promote({into, where}: {into: IntoSpec<B>, where: MatchSpec<A, PreA>}) {
    this.rules.push({
      type: TransformType.promotion,
      into,
      where,
    });
  }
}

export class Language<A extends Record<string, ABC.AnyAlphabet>[]> {
  public readonly abcNames: OrderedObjOf<A>;

  public rules: {
    // https://github.com/microsoft/TypeScript/issues/45281 means we need a jankier solution
    [KI in List.UnionOf<KeysAndIndicesOf<typeof this.abcNames>> as KI[0]]: Rule<
      typeof this.abcNames[KI[1]][1],
      ShiftedObjOf<typeof this.abcNames>[KI[0]],
      RevTail<List.Extract<typeof this.abcNames, 0, KI[1]>>
  >[]};

  public readonly abcs: MergeObjs<A>;
  public readonly select: NextMappedFuncs<typeof this.abcNames>;

  // All of the `any` types I'm using below are unimportant
  // Because in reality my alphabet-related mapped types have already
  // taken care of determining the right types for these objects
  // So I'm just using `any` to forcibly assign stuff to those types
  // in cases where the type inference gives me 0 way of getting TypeScript
  // to actually agree with me about what I'm assigning
  // In other words I'm making two assumptions here: first that my runtime
  // code is correct and says the same thing as my mapped types (which I
  // gotta verify manually in eg REPL), and second that my handcrafted
  // mapped types know more than the type inference below would
  constructor(...abcs: $<A>) {
    this.abcs = Object.assign({}, ...abcs);
    this.abcNames = abcs.map(o => Object.entries(o)[0]) as any;
    this.rules = Object.fromEntries(this.abcNames.map(name => [name, []]));

    this.select = Object.fromEntries(
      this.abcNames.map(([layer, alphabet], idx) => [
        layer,
        (
          funcs: Record<string, InnerCaptureFunc<any, any, []>>,
        ) => {
          const next = this.abcNames[idx + 1]?.[1];
          Object.entries(funcs).forEach(([feature, func]) => {
            const f = Object.assign(
              (obj: Partial<any>) => new CaptureApplier<any, any, []>(
                this.rules[layer as keyof typeof this.rules],
                layer, obj, feature,
              ),
              Object.fromEntries(alphabet.types.forEach((type: string) => [
                type,
                (obj: Partial<any>) => new CaptureApplier<any, any, []>(
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
