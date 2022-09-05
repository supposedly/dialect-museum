// type system likes being silly and not accepting that KeysAndIndicesOf<> produces
// tuples [K, V] where K is a valid key and V is a valid value

import {List} from 'ts-toolbelt';
import * as ABC from '../../../alphabets/common';
import * as Accents from '../../../accents/common';
import {
  OrderedObj,
  DropLast,
  ObjectOf,
  OrderedObjOf,
  TransformType,
  ShiftedObjOf,
  KeysAndIndicesOf,
} from '../type';
import {DeepMatchOr, MatchAny, MatchOne, MatchNot, MatchNone} from '../match';
import {ArrayOr, DeepMerge, MergeUnion, ValuesOf} from '../../../utils/typetools';

// so I can use these to force it to realize it's fine while I figure out what's even wrong
export type Force<T, B> = T extends B ? T : never;
export type ForceKey<T, K> = K extends keyof T ? T[K] : never;

export type Capturable<A extends ABC.AnyAlphabet> = ValuesOf<{
  [T in ABC.TypeNames<A>]: DeepMatchOr<DeepMerge<ABC._ExactAllOfType<A, T>>>
}>;

export type CaptureFuncs<
  Curr extends Accents.AnyLayer,
  Next extends ABC.AnyAlphabet,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
> = {
  [Feature in Accents.AccentFeatures<Curr>]?: (
    capture: (<
      // I originally put this out here in a generic so I could Function.Narrow<> it below
      // But then it turned out that its type inference was actually narrower WITHOUT Function.Narrow<> than
      // with... and that it specifically still needs to be an `extends` generic for it to work that way,
      // so I still can't put this directly in type position
      // Overall what this says is that I still don't know enough about TS's type system!
      // -------------------
      // anyway the idea is that you can pass capture() any of the following:
      // - an actual member of the current alphabet
      // - a partial specification that overlaps with one or more members of the current alphabet
      // - a match() thing that says to match parts of members of the current alphabet
      O extends Capturable<Curr>,
    >(obj: O) => CaptureApplier<typeof obj, Curr, Next, ABCHistory, Feature>)
    & {
      [T in ABC.TypeNames<Curr>]: <O extends DeepMatchOr<DeepMerge<ABC._ExactAllOfType<Curr, T>>>>(
        obj: O
      ) => CaptureApplier<typeof obj, Curr, Next, ABCHistory, Feature>
    },
    abc: ABC.ABC<Curr>,
    nextABC: ABC.ABC<Next>
  ) => Array<Rule<never, Curr, Next, ABCHistory, Feature>>
};

export type SelectFunc<
  Curr extends Accents.AnyLayer,
  Next extends Accents.AnyLayer,
  ABCHistory extends OrderedObj<string, Accents.AnyLayer>,
> = (rules: CaptureFuncs<Curr, Next, ABCHistory>) => void;

export type _NextMappedFuncs<
  O extends OrderedObj<string, ABC.AnyAlphabet>,
  _O = ObjectOf<O>, _Shifted = ShiftedObjOf<O>,
> = {
  [KI in List.UnionOf<DropLast<KeysAndIndicesOf<O>>> as KI[0]]: SelectFunc<
    _O[KI[0]] extends Accents.AnyLayer ? _O[KI[0]] : never,
    _Shifted[KI[0]] extends Accents.AnyLayer ? _Shifted[KI[0]] : never,
    List.Extract<O, 0, KI[1]>
  >;
};
export type NextMappedFuncs<O extends OrderedObj<string, ABC.AnyAlphabet>> = _NextMappedFuncs<O>;

export type RawAlphabets = Record<string, NonNullable<ABC.AnyAlphabet>>;
export type Alphabets = List.List<RawAlphabets>;
export type FirstABC<A extends Alphabets> = OrderedObjOf<A>[0][1];
export type InputText<A extends Alphabets> = ValuesOf<FirstABC<A>>[];

// Wanted to restructure this to take {next: {consonant: ..., _: ...}, prev: {consonant: ..., vowel: ...}}
// instead of the current {nextConsonant: ..., next: ..., prevConsonant: ..., prevVowel: ...}
// which would make things a lot easier to parse
// but I kept running into a 'type instantiation is excessively deep and possibly infinite'!
export type MatchSpec<
  A extends ABC.AnyAlphabet,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
> = DeepMatchOr<MergeUnion<
  | ValuesOf<{
    [Dir in `next` | `prev`]: {
      [T in ABC.TypeNames<A> as `${Dir}${Capitalize<T>}`]: {  // Adding ` // to help GitHub's syntax-coloring bc bugged
          spec: DeepMerge<ABC._ExactAllOfType<A, T>>
          env: MatchSpec<A, ABCHistory>
        }
      }
  }>
  | {
    [Dir in `next` | `prev`]: {
      spec: ValuesOf<{[T in ABC.TypeNames<A>]: DeepMerge<ABC._ExactAllOfType<A, T>>}>
      env: MatchSpec<A, ABCHistory>
    }
  }
  | {
    was: {
      // Pre[KI[1]][1] is like `value of Pre at index I` and it's the AnyAlphabet at some layer
      [KI in List.UnionOf<KeysAndIndicesOf<ABCHistory>> as Force<KI[0], string>]: ValuesOf<{
        [T in ABC.TypeNames<ABCHistory[KI[1]][1]>]: DeepMerge<ABC._ExactAllOfType<ABCHistory[KI[1]][1], T>>
      }>
      // {_: /* see above ^ */, env: MatchSpec<Pre[KI[1]][1], List.Extract<Pre, 0, KI[0]>>}
      // that doesn't work bc type instantiation is excessively deep for `env`'s value
      // so I'm gambling on hopefully never having to refer to the environment of a previous
      // layer in actual runtime code (wow runtime code is a thing that exists)
    }
  }
>>;

export type _IntoHelper<Captured, ABCValues> =
  Captured extends ABCValues
  ? Captured  // capture(abc.letter) means use that letter directly
  // else check inside match
  : Captured extends (MatchOne<infer T extends ABCValues> | MatchAny<infer T extends ABCValues>)
    ? T  // capture(match.any([abc.letter1, abc.letter2])) means use letter1 | letter2 directly
    // also check for not-match bc why not
    : Captured extends (MatchNot<infer T extends ABCValues> | MatchNone<infer T extends ABCValues>)
      ? Exclude<ABCValues, T>  // capture(match.not(abc.letter)) means all letters except that one
      : ABCValues;  // else again just accept everything

export type IntoSpec<
  Captured,
  A extends Accents.AnyLayer,
  B extends ABC.AnyAlphabet,
  Feature extends Accents.AccentFeatures<A>,
> = Partial<Record<
  Accents.AccentFeature<A, Feature>,
  | ArrayOr<ABC.ValuesOfABC<B>>
  | ((input: _IntoHelper<Captured, ABC.ValuesOfABC<A>>, abc?: B) => ArrayOr<ABC.ValuesOfABC<B>>)
>>;

export type CapturableOr<T, A extends ABC.AnyAlphabet> =
  [T] extends [never]
    ? Capturable<A>
    : T extends Capturable<A>
      ? T
      : Capturable<A>;

type _OrderingConstraint<A extends Accents.AnyLayer> = Record<Accents.AccentFeatures<A>, number>;

export type OrderingConstraints<A extends Accents.AnyLayer> = {
  before?: _OrderingConstraint<A>,
  after?: _OrderingConstraint<A>,
};

export type TransformRule<
  Captured,
  A extends Accents.AnyLayer,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
  Feature extends Accents.AccentFeatures<A>,
> = {
  type: TransformType.transformation
  from: CapturableOr<Captured, A>
  into: IntoSpec<Captured, A, A, Feature>
  where: MatchSpec<A, ABCHistory>
  order: OrderingConstraints<A>
};

export type PromoteRule<
  Captured,
  A extends Accents.AnyLayer,
  B extends ABC.AnyAlphabet,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
  Feature extends Accents.AccentFeatures<A>,
> = {
  type: TransformType.promotion
  from: CapturableOr<Captured, A>
  into: IntoSpec<Captured, A, B, Feature>
  where: MatchSpec<A, ABCHistory>
  order: OrderingConstraints<A>
};

export type Rule<
  Captured = never,
  A extends Accents.AnyLayer = any,
  B extends ABC.AnyAlphabet = any,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet> = [],
  Feature extends Accents.AccentFeatures<A> = Accents.AccentFeatures<A>,
> =
  | TransformRule<Captured, A, ABCHistory, Feature>
  | PromoteRule<Captured, A, B, ABCHistory, Feature>;

export type _TransformFuncs<C extends CaptureApplier<any, any, any, [], any>> = {
  transform: C[`transform`]
  promote: C[`promote`]
};

export type TransformParam<
  Captured,
  A extends Accents.AnyLayer,
  B extends ABC.AnyAlphabet,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
  Feature extends Accents.AccentFeatures<A>,
> = {
  into: IntoSpec<Captured, A, B, Feature>
  where: MatchSpec<A, ABCHistory>
  order?: OrderingConstraints<A>
};

export interface CaptureApplier<
  Captured,
  A extends Accents.AnyLayer,
  B extends ABC.AnyAlphabet,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
  Feature extends Accents.AccentFeatures<A>,
> {
  transform(
    {into, where, order = {}}: TransformParam<Captured, A, A, ABCHistory, Feature>
  ): TransformRule<Captured, A, ABCHistory, Feature> & _TransformFuncs<this>;

  promote(
    {into, where, order = {}}: TransformParam<Captured, A, B, ABCHistory, Feature>,
  ): PromoteRule<Captured, A, B, ABCHistory, Feature> & _TransformFuncs<this>;
}
