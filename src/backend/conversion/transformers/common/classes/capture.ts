/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import {List} from 'ts-toolbelt';

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
import {ArrayOr, DeepMerge, MergeUnion, UnionOf, ValuesOf, Narrow} from '../../../utils/typetools';

// type system likes being silly and not accepting that KeysAndIndicesOf<> produces
// tuples [K, V] where K is a valid key and V is a valid value
// so I can use these to force it to realize it's fine while I figure out what's even wrong
type Force<T, B> = T extends B ? T : never;
type ForceKey<T, K> = K extends keyof T ? T[K] : never;

type Capturable<A extends ABC.AnyAlphabet> = ValuesOf<{
  [T in ABC.TypeNames<A>]: DeepMatchOr<DeepMerge<ABC.AllOfType<A, T>>>
}>;

type CaptureFunc<
  Curr extends ABC.AnyAlphabet,
  Next extends ABC.AnyAlphabet,
  PreCurr extends OrderedObj<string, ABC.AnyAlphabet>,
> = (
  capture:
  (<
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
    >(obj: O) => CaptureApplier<typeof obj, Curr, Next, PreCurr>)
    // and if you happen to have passed something that can be resolved to one or more concrete members of
    // the current alphabet *AND nothing else* (namely: any of match(abc.letter), match.not(abc.letter),
    // match.any(abc.letter1, abc.letter2)), match.none(abc.letter1, abc.letter2), OR literally just abc.letter),
    // then if you attach a function to {into: ...}, that function's `input` parameter will be constrained
    // to the type of that/those concrete member(s) and nothing else
    // OTHERWISE, if no such constriction is resolvable, then that function's `input` parameter will just
    // be typed with the entire union ABC.ValuesOfABC<Curr>
    // I would love to have it actually recursively resolve the Match<>-es to a series of Exclude<>s and
    // Extract<>s but I don't think it's possible -- or at least I'm not good enough with type-wrangling magic to
    // know how to do it -- so this is the best I've got for now
  & {
    [T in ABC.TypeNames<Curr>]: <O extends DeepMatchOr<DeepMerge<ABC.AllOfType<Curr, T>>>>(
      obj: O
    ) => CaptureApplier<typeof obj, Curr, Next, PreCurr>
  },
  abc: ABC.ABC<Curr>,
  nextABC: ABC.ABC<Next>
) => Record<string, ArrayOr<Rule<never, Curr, Next, PreCurr>>>;
// I have to use `never` there because I can't access the value of O out here :(
// Every single hack I tried inevitably produced a wider `Captured` type out here than
// the actual `O` inside the capture func, and that runs up against contravariance,
// which there's (I guess this is a good thing?) no way to override
// Specifically: I'm assigning the return value of the capture func's CaptureApplier methods,
// which use a really narrow value of O for `Captured`, to a value in a record that's typed
// with a wider `Captured`
// And this type is specifically used in a function parameter for `into`
// So by the letter of the law that violates contravariance and I don't know enough to dispute it :]
// Naturally you can't get around that by using `any` or `unknown` because those are even wider
// So the only type that works there is `never` and the downside is that until I can find
// a better solution I have to call such functions using `as never` to coerce the first parameter
// (This isn't a huge dealbreaker because my main reason for doing all this is to have typehints
// and live validation for what I punch in manually, but either way it'd still be nice to at least
// have it validate that I'm using the right alphabet or whatever when calling an `into` function)

type SelectFunc<
  Curr extends ABC.AnyAlphabet,
  Next extends ABC.AnyAlphabet,
  PreCurr extends OrderedObj<string, ABC.AnyAlphabet>,
> = (createRules: CaptureFunc<Curr, Next, PreCurr>) => void;

type _NextMappedFuncs<O extends OrderedObj<string, ABC.AnyAlphabet>, _O = ObjectOf<O>, _Shifted = ShiftedObjOf<O>> = {
  [KI in List.UnionOf<DropLast<KeysAndIndicesOf<O>>> as KI[0]]: SelectFunc<
    _O[KI[0]] extends ABC.AnyAlphabet ? _O[KI[0]] : never,
    _Shifted[KI[0]] extends ABC.AnyAlphabet ? _Shifted[KI[0]] : never,
    DropLast<List.Extract<O, 0, KI[1]>>
  >;
};
type NextMappedFuncs<O extends OrderedObj<string, ABC.AnyAlphabet>> = _NextMappedFuncs<O>;

type RawAlphabets = Record<string, NonNullable<ABC.AnyAlphabet>>;
type Alphabets = List.List<RawAlphabets>;
type FirstABC<A extends Alphabets> = OrderedObjOf<Narrow<A>>[0][1];
type InputText<A extends Alphabets> = FirstABC<A>[keyof FirstABC<A>][];

type MatchSpec<A extends ABC.AnyAlphabet, Pre extends OrderedObj<string, ABC.AnyAlphabet>> = DeepMatchOr<MergeUnion<
  | ValuesOf<{
    [Dir in `next` | `prev`]: {
      [T in ABC.TypeNames<A> as `${Dir}${Capitalize<T>}`]: {  // Adding ` // to help GitHub's syntax-coloring bc bugged
          _: DeepMerge<ABC.AllOfType<A, T>>
          env: MatchSpec<A, Pre>
        }
      }
  }>
  | {
    [Dir in `next` | `prev`]: {
      _: ValuesOf<{[T in ABC.TypeNames<A>]: DeepMerge<ABC.AllOfType<A, T>>}>
      env: MatchSpec<A, Pre>
    }
  }
  | {
    was: {
      // Pre[KI[1]][1] is like `value of Pre at index I` and it's the AnyAlphabet at some layer
      [KI in List.UnionOf<KeysAndIndicesOf<Pre>> as Force<KI[0], string>]: ValuesOf<{
          [T in ABC.TypeNames<Pre[KI[1]][1]>]: DeepMerge<ABC.AllOfType<Pre[KI[1]][1], T>>
        }>
        // {_: /* see above ^ */, env: MatchSpec<Pre[KI[1]][1], List.Extract<Pre, 0, KI[0]>>}
        // that doesn't work bc type instantiation is excessively deep for `env`'s value
        // so I'm gambling on hopefully never having to refer to the environment of a previous
        // layer in actual runtime code (wow runtime code is a thing that exists)
    }
  }
>>;

type _IntoHelper<Captured, ABCValues> =
  Captured extends ABCValues
  ? Captured  // capture(abc.letter) means use that letter directly
  // else check inside match
  : Captured extends (MatchOne<infer T extends ABCValues> | MatchAny<infer T extends ABCValues>)
    ? T  // capture(match.any([abc.letter1, abc.letter2])) means use letter1 | letter2 directly
    // also check for not-match bc why not
    : Captured extends (MatchNot<infer T extends ABCValues> | MatchNone<infer T extends ABCValues>)
      ? Exclude<ABCValues, T>  // capture(match.not(abc.letter)) means all letters except that one
      : ABCValues;  // else again just accept everything

type IntoSpec<
  Captured,
  A extends ABC.AnyAlphabet,
  B extends ABC.AnyAlphabet,
> = Record<
  string,  // TODO: replace with union of specific accent features from somewhere or other
  | ArrayOr<ABC.ValuesOfABC<B>>
  | ((input: _IntoHelper<Captured, ABC.ValuesOfABC<A>>, abc?: B) => ArrayOr<ABC.ValuesOfABC<B>>)
>;

type CapturableOr<T, A extends ABC.AnyAlphabet> =
  [T] extends [never]
    ? Capturable<A>
    : T extends Capturable<A>
      ? T
      : Capturable<A>;

type Rule<
  Captured,
  A extends ABC.AnyAlphabet,
  B extends ABC.AnyAlphabet,
  PreA extends OrderedObj<string, ABC.AnyAlphabet>,
> =
  | {
    type: TransformType.promotion,
    from: CapturableOr<Captured, A>,
    into: IntoSpec<Captured, A, B>,
    where: MatchSpec<A, PreA>
  }
  | {
    type: TransformType.transformation,
    from: CapturableOr<Captured, A>,
    into: IntoSpec<Captured, A, A>,
    where: MatchSpec<A, PreA>
  };

type _TransformFuncs<C extends CaptureApplier<any, any, any, []>> = {
  transform: C[`transform`],
  promote: C[`promote`]
};

class CaptureApplier<
  Captured,
  A extends ABC.AnyAlphabet,
  B extends ABC.AnyAlphabet,
  PreA extends OrderedObj<string, ABC.AnyAlphabet>,
> {
  constructor(
    private obj: CapturableOr<Captured, A>,
  ) {}

  transform(
    {into, where}: {into: IntoSpec<Captured, A, A>, where: MatchSpec<A, PreA>},
  ): Rule<Captured, A, A, PreA> & _TransformFuncs<typeof this> {
    return {
      type: TransformType.transformation,
      from: this.obj,
      into,
      where,
      transform: this.transform,
      promote: this.promote,
    };
  }

  promote(
    {into, where}: {into: IntoSpec<Captured, A, B>, where: MatchSpec<A, PreA>},
  ): Rule<Captured, A, B, PreA> & _TransformFuncs<typeof this> {
    return {
      type: TransformType.promotion,
      from: this.obj,
      into,
      where,
      transform: this.transform,
      promote: this.promote,
    };
  }
}

export class Language<A extends Record<string, ABC.AnyAlphabet>[]> {
  public readonly layerNames: OrderedObjOf<A>;

  public rules: {
    // https://github.com/microsoft/TypeScript/issues/45281 means we need a jankier
    // way of extracting ranges from a list (specifically we can't go fancy and
    // get Head from smth like [...infer Head, (`specific item`), ...infer _Tail])
    [KI in UnionOf<KeysAndIndicesOf<typeof this.layerNames>> as Force<KI[0], string>]:
      Record<
        string,
        Array<Rule<
          // Boils down to `null | ABC.ValuesOfABC<typeof this.abcNames[KI[0]]>`
          // which means `null | (union of members of the alphabet whose name is the current key)`
          null | ABC.ValuesOfABC<Force<ForceKey<ShiftedObjOf<typeof this.layerNames>, KI[0]>, ABC.AnyAlphabet>>,
          typeof this.layerNames[KI[1]][1],
          // Boils down to `typeof this.abcNames[KI[0]]`
          // which means the same as above!
          Force<ForceKey<ShiftedObjOf<typeof this.layerNames>, KI[0]>, ABC.AnyAlphabet>,
          DropLast<List.Extract<typeof this.layerNames, 0, Force<KI[1], `${number}`>>>
        >>
      >
  };

  public readonly abcs: MergeObjs<A>;
  public readonly select: NextMappedFuncs<typeof this.layerNames>;

  // All of the `any` types I'm using below are unimportant
  // Because in reality my alphabet-related mapped types have already
  // taken care of determining the right types for these objects
  // So I'm just using `any` to forcibly assign stuff to those types
  // in cases where the type inference gives me 0 way of getting TypeScript
  // to actually agree with me about what I'm assigning
  // In other words I'm making two assumptions here: first that my runtime
  // code is correct and says the same thing as my mapped types (which I
  // gotta verify manually in eg REPL), and second that my handmade
  // mapped types know more than the type inference below would
  constructor(...abcs: Narrow<A>) {
    this.abcs = Object.assign({}, ...abcs);
    this.layerNames = abcs.map(o => Object.entries(o)[0]) as any;
    this.rules = Object.fromEntries(this.layerNames.map(name => [name, {}]));

    this.select = Object.fromEntries(
      this.layerNames.map(([layer, alphabet], idx) => [
        layer,
        (
          createRules: CaptureFunc<any, any, []>,
        ) => {
          // me when I'm typesafe
          const rules = (this.rules as Record<string, Record<string, Rule<never, any, any, []>[]>>)[layer];
          const capture = Object.assign(
            (obj: Partial<any>) => new CaptureApplier<any, any, any, []>(obj),
            Object.fromEntries(alphabet.types.forEach((type: string) => [
              type,
              (obj: Partial<any>) => new CaptureApplier<any, any, any, []>({...obj, type}),
            ])),
          );
          const nextAlphabet = this.layerNames[idx + 1]?.[1];
          Object.entries(createRules(capture, alphabet, nextAlphabet)).forEach(
            ([accent, rule]) => {
              if (rules[accent] === undefined) {
                rules[accent] = [];
              }
              if (Array.isArray(rule)) {
                rules[accent].push(...rule);
              } else {
                rules[accent].push(rule);
              }
            },
          );
        },
      ]),
    );
  }

  applyTo(text: InputText<A>): InputText<A> {
    return this && text;
  }
}
