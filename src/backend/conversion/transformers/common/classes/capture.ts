/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import {Function as Func, List} from 'ts-toolbelt';

import * as ABC from '../../../alphabets/common';
import {
  OrderedObj,
  DropLast,
  ObjectOf,
  OrderedObjOf,
  MergeObjs,
  TransformType,
  ShiftedObjOf,
  KeysAndIndicesOf,
} from '../type';
import {DeepMatchOr, MatchAny, MatchOne, MatchNot, MatchNone} from '../match';

type $<T> = Func.Narrow<T>;
type ValuesOf<O> = O[keyof O];

// type system likes being silly and not accepting that KeysAndIndicesOf<> produces
// tuples [K, V] where K is a valid key and V is a valid value
// so I can use these to force it to realize it's fine while I figure out what's even wrong
type Force<T, B> = T extends B ? T : never;
type ForceKey<T, K> = K extends keyof T ? T[K] : never;

// https://stackoverflow.com/questions/63542526/merge-discriminated-union-of-object-types-in-typescript
// I can't use ts-toolbelt's MergeUnion<> because for some reason it randomly produces `unknowns` under
// some compilers and not others...
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type MergeUnion<U> = UnionToIntersection<U> extends infer O ? {[K in keyof O]: O[K]} : never;

// Same as MergeUnion<> but recursive
type DeepMerge<O> = [O] extends [object] ? {
  // I think the MergeUnion<O> helps it not distribute or something? Not sure exactly what's
  // going on but it doesn't work without it if O is a union :(
  [K in keyof MergeUnion<O> & keyof O]: DeepMerge<O[K]>
  // Now with that settled it does work if you just do:
  //  [K in keyof MergeUnion<O>]: DeepMerge<MergeUnion<O>[K]>
  // but in the interest of not duplicating that MergeUnion<O>, you might want to try:
  //  * [K in keyof MergeUnion<O>]: DeepMerge<O[K]>
  // which SHOULD be the same -- but TypeScript ofc doesn't love it unless you go
  //  [K in keyof MergeUnion<O>]: K extends keyof O ? DeepMerge<O[K]> : never
  // so in the double-interest of not having that conditional, that `&` is my best solution
} : O;

// using ts-toolbelt's List.UnionOf<> was giving some bad "type instantiation is excessively deep and
// possibly infinite" errors
// this works instead and is hopefully simpler (probably don't need whatever complex failsafes List.UnionOf<> has...)
type UnionOf<L extends unknown[]> = L extends [infer Head, ...infer Tail] ? Head | UnionOf<Tail> : never;

type InnerCaptureFunc<
  Curr extends ABC.AnyAlphabet,
  Next extends ABC.AnyAlphabet,
  PreCurr extends OrderedObj<string, ABC.AnyAlphabet>,
> = (
  capture:
    (
      <
        // I originally put this out here in a generic so I could Function.Narrow<> it below
        // But then it turned out that its type inference was actually narrower without Function.Narrow<> than
        // with... and that it specifically still needs to be an `extends` generic for it to work that way,
        // so I still can't put this directly in type position
        // Overall what this says is that I still don't know enough about TS's type system!
        // -------------------
        // anyway the idea is that you can pass capture() any of the following:
        // - an actual member of the current alphabet
        // - a partial specification that overlaps with one or more members of the current alphabet
        // - a match() thing that says to match parts of members of the current alphabet
        O extends ValuesOf<{[T in ABC.Types<Curr>]: DeepMatchOr<DeepMerge<ABC.AllOfType<Curr, T>>>}>,
      >(obj: O) => CaptureApplier<typeof obj, Curr, Next, PreCurr>)
      // and if you happen to have passed something that can be resolved to one or more concrete members of
      // the current alphabet *AND nothing else* (namely: any of match(abc.letter), match.not(abc.letter),
      // match.any(abc.letter1, abc.letter2)), match.none(abc.letter1, abc.letter2), OR literally just abc.letter),
      // then if you attach a function to {into: ...}, that function's `input` parameter will be constrained
      // to the type of that/those concrete member(s) and nothing else
      // OTHERWISE, if no such constriction is resolvable, then that function's `input` parameter will just
      // be typed with the entire union ABC.ValuesOfABC<Curr>
    & {
      [T in ABC.Types<Curr>]: (
        obj: DeepMatchOr<DeepMerge<ABC.AllOfType<Curr, T>>>
      ) => CaptureApplier<null, Curr, Next, PreCurr>
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

type _NextMappedFuncs<O extends OrderedObj<string, ABC.AnyAlphabet>, _O = ObjectOf<O>, _Shifted = ShiftedObjOf<O>> = {
  [KI in List.UnionOf<DropLast<KeysAndIndicesOf<O>>> as KI[0]]: CaptureFunc<
    _O[KI[0]] extends ABC.AnyAlphabet ? _O[KI[0]] : never,
    _Shifted[KI[0]] extends ABC.AnyAlphabet ? _Shifted[KI[0]] : never,
    DropLast<List.Extract<O, 0, KI[1]>>
  >;
};
type NextMappedFuncs<O extends OrderedObj<string, ABC.AnyAlphabet>> = _NextMappedFuncs<O>;

type RawAlphabets = Record<string, NonNullable<ABC.AnyAlphabet>>;
type Alphabets = List.List<RawAlphabets>;
type FirstABC<A extends Alphabets> = OrderedObjOf<Func.Narrow<A>>[0][1];
type InputText<A extends Alphabets> = FirstABC<A>[keyof FirstABC<A>][];

type MatchSpec<A extends ABC.AnyAlphabet, Pre extends OrderedObj<string, ABC.AnyAlphabet>> = DeepMatchOr<MergeUnion<
  | ValuesOf<{
    [Dir in `next` | `prev`]: {
      [T in ABC.Types<A> as `${Dir}${Capitalize<T>}`]: {  // Adding ` // to help GitHub's syntax-highlighting bc bugged
          _: DeepMerge<ABC.AllOfType<A, T>>
          env: MatchSpec<A, Pre>
        }
      }
  }>
  | {
    [Dir in `next` | `prev`]: {
      _: ValuesOf<{[T in ABC.Types<A>]: DeepMerge<ABC.AllOfType<A, T>>}>
      env: MatchSpec<A, Pre>
    }
  }
  | {
    was: {
      // Pre[KI[1]][1] is like `value of Pre at index I` and it's the AnyAlphabet at some layer
      [KI in List.UnionOf<KeysAndIndicesOf<Pre>> as Force<KI[0], string>]: ValuesOf<{
          [T in ABC.Types<Pre[KI[1]][1]>]: DeepMerge<ABC.AllOfType<Pre[KI[1]][1], T>>
        }>
        // {_: /* see above ^ */, env: MatchSpec<Pre[KI[1]][1], List.Extract<Pre, 0, KI[0]>>}
        // that doesn't work bc type instantiation is excessively deep for `env`'s value
        // so I'm gambling on hopefully never having to refer to the environment of a previous
        // layer in actual runtime code (wow that exists)
    }
  }
>>;

type OrArray<T> = T | T[];
type _IntoHelper<Captured, ABCValues> =
  Captured extends ABCValues
    ? Captured  // capture(abc.letter) means use that letter directly
    : Captured extends (MatchOne<infer T> | MatchAny<infer T>)  // else check inside match
      ? T extends ABCValues  // this will be one level cleaner come typescript 4.7!
        ? T  // capture(match.any([abc.letter1, abc.letter2])) means use letter1 | letter2 directly
        : ABCValues  // else just accept everything
      : Captured extends (MatchNot<infer T> | MatchNone<infer T>)   // also check for not-match bc why not
        ? T extends ABCValues
          ? Exclude<ABCValues, T>  // capture(match.not(abc.letter)) means all letters except that one
          : ABCValues  // else again just accept everything
        : ABCValues;  // ditto

type IntoSpec<
  Captured,
  A extends ABC.AnyAlphabet,
  B extends ABC.AnyAlphabet,
> = Record<
  string,  // TODO: replace with union of specific accent features from somewhere or other
  | OrArray<ABC.ValuesOfABC<B>>
  | ((input: _IntoHelper<Captured, ABC.ValuesOfABC<A>>, abc: B) => OrArray<ABC.ValuesOfABC<B>>)
>;

type Rule<
  Captured,
  A extends ABC.AnyAlphabet,
  B extends ABC.AnyAlphabet,
  PreA extends OrderedObj<string, ABC.AnyAlphabet>,
> =
  | {
    type: TransformType.promotion,
    into: IntoSpec<Captured, A, B>,
    where: MatchSpec<A, PreA>
  }
  | {
    type: TransformType.transformation,
    into: IntoSpec<Captured, A, A>,
    where: MatchSpec<A, PreA>
  };

class CaptureApplier<
  Captured,
  A extends ABC.AnyAlphabet,
  B extends ABC.AnyAlphabet,
  PreA extends OrderedObj<string, ABC.AnyAlphabet>,
> {
  constructor(
    private rules: Rule<Captured, A, B, PreA>[],
    private layer: string,
    private obj: Partial<A[keyof A]>,
    private feature: string,
  ) {}

  transform({into, where}: {into: IntoSpec<Captured, A, A>, where: MatchSpec<A, PreA>}) {
    this.rules.push({
      type: TransformType.transformation,
      into,
      where,
    });
  }

  promote({into, where}: {into: IntoSpec<Captured, A, B>, where: MatchSpec<A, PreA>}) {
    this.rules.push({
      type: TransformType.promotion,
      into,
      where,
    });
  }
}

export class Language<A extends Record<string, ABC.AnyAlphabet>[]> {
  public readonly abcNames: OrderedObjOf<A>;  // don't even know at this point if i need $<A> or not

  public rules: {
    // https://github.com/microsoft/TypeScript/issues/45281 means we need a jankier
    // way of extracting ranges from a list (specifically we can't go fancy and
    // get Head from smth like [...infer Head, (`specific item`), ...infer _Tail])
    [KI in UnionOf<KeysAndIndicesOf<typeof this.abcNames>> as Force<KI[0], string>]: Array<Rule<
      // Boils down to `null | ABC.ValuesOfABC<typeof this.abcNames[KI[0]]>`
      // which means `null | (union of members of the alphabet whose name is the current key)`
      null | ABC.ValuesOfABC<Force<ForceKey<ShiftedObjOf<typeof this.abcNames>, KI[0]>, ABC.AnyAlphabet>>,
      typeof this.abcNames[KI[1]][1],
      // Boils down to `typeof this.abcNames[KI[0]]`
      // which means the same as above!
      Force<ForceKey<ShiftedObjOf<typeof this.abcNames>, KI[0]>, ABC.AnyAlphabet>,
      DropLast<List.Extract<typeof this.abcNames, 0, Force<KI[1], `${number}`>>>
    >>
  };

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
              (obj: Partial<any>) => new CaptureApplier<any, any, any, []>(
                this.rules[layer as keyof typeof this.rules] as any,
                layer, obj, feature,
              ),
              Object.fromEntries(alphabet.types.forEach((type: string) => [
                type,
                (obj: Partial<any>) => new CaptureApplier<any, any, any, []>(
                  this.rules[layer as keyof typeof this.rules] as any,
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
