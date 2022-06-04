/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import * as ABC from '../../../alphabets/common';
import {Narrow as $} from '../../../utils/typetools';
import {TrackerList} from './tracker';
import {
  OrderedObj,
  OrderedObjOf,
  MergeObjs,
  TransformType,
} from '../type';
import {
  CaptureApplier as ICaptureApplier,
  CapturableOr,
  IntoSpec,
  MatchSpec,
  _TransformFuncs,
  Force,
  NextMappedFuncs,
  CaptureFunc,
  InputText,
  Rule,
} from './capture-types';

class CaptureApplier<
  Captured,
  A extends ABC.AnyAlphabet,
  B extends ABC.AnyAlphabet,
  PreA extends OrderedObj<string, ABC.AnyAlphabet>,
> implements ICaptureApplier<Captured, A, B, PreA> {
  constructor(
    private obj: CapturableOr<Captured, A>,
  ) {}

  transform(
    {into, where}: {into: IntoSpec<Captured, A, A>, where: MatchSpec<A, PreA>},
  ): Rule<Captured, A, A, PreA> & _TransformFuncs<this> {
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
  ): Rule<Captured, A, B, PreA> & _TransformFuncs<this> {
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

type UghGetKeysOf<T extends Record<string, ABC.AnyAlphabet>[]> =
  T extends [Record<infer K extends string, unknown>, ...infer Tail extends Record<string, ABC.AnyAlphabet>[]]
    ? K | UghGetKeysOf<Tail>
    : never;

type UghGetABCLinearly<T extends Record<string, ABC.AnyAlphabet>[], N extends string> =
  T extends [infer Head, ...infer Tail extends Record<string, ABC.AnyAlphabet>[]]
    ? Head extends Record<N, infer A>
      ? Force<A, ABC.AnyAlphabet>
      : UghGetABCLinearly<Tail, N>
    : never;

export class Language<A extends Record<string, ABC.AnyAlphabet>[]> {
  public readonly layers: OrderedObjOf<A>;

  public rules: Record<string, Record<string, Array<Rule>>>;

  public readonly abcs: MergeObjs<A>;
  public readonly select: NextMappedFuncs<this[`layers`]>;

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
  constructor(...abcs: $<A>) {
    this.abcs = Object.assign({}, ...abcs);
    this.layers = abcs.map(o => Object.entries(o)) as any;
    this.rules = Object.fromEntries(this.layers.map(name => [name, {}]));
    this.select = Object.fromEntries(
      this.layers.map(([layer, alphabet], idx) => [
        layer,
        (
          createRules: CaptureFunc<any, any, []>,
        ) => {
          // me when I'm typesafe
          const rules = this.rules[layer];
          const capture = Object.assign(
            (obj: Partial<any> = {}) => new CaptureApplier<any, any, any, []>(obj),
            Object.fromEntries(alphabet.types.forEach((type: string) => [
              type,
              (obj: Partial<any> = {}) => new CaptureApplier<any, any, any, []>({...obj, type}),
            ])),
          );
          const nextAlphabet = this.layers[idx + 1]?.[1];
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

  apply<N extends UghGetKeysOf<A>>(
    layer: N,
    text: Array<ABC.ValuesOfABC<UghGetABCLinearly<A, N>>>,
  ): TrackerList {
    return new TrackerList(
      this.rules,
      this.layers,
    ).feed(layer, text);
  }
}
