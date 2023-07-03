/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import * as ABC from '../../../alphabets/common';
import * as Layers from '../../../layers/common';
import {Narrow as $, Force} from '../../../utils/typetools';
import {TrackerList} from './tracker';
import {
  OrderedObj,
  OrderedObjOf,
  MergeObjs,
} from '../type';
import {
  CaptureApplier as ICaptureApplier,
  TopLayerCaptureApplier as ITopLayerCaptureApplier,
  CapturableOr,
  NextMappedFuncs,
  CaptureFuncs,
  Rule,
  TransformRule,
  PromoteRule,
  TransformParam,
  TransformType,
  TopLayerCaptureFuncs,
} from './capture-types';

class CaptureApplier<
  Captured,
  A extends Layers.AnyLayer,
  B extends ABC.AnyAlphabet,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
  Feature extends Layers.AccentFeatures<A>,
> implements ICaptureApplier<Captured, A, B, ABCHistory, Feature> {
  constructor(
    private obj: CapturableOr<Captured, A>,
  ) {}

  transform(
    {into, where}: TransformParam<Captured, A, A, ABCHistory, Feature>,
  ): TransformRule<Captured, A, ABCHistory, Feature> {
    return {
      type: TransformType.transformation,
      from: this.obj,
      into,
      where,
    };
  }

  promote(
    {into, where}: TransformParam<Captured, A, B, ABCHistory, Feature>,
  ): PromoteRule<Captured, A, B, ABCHistory, Feature> {
    return {
      type: TransformType.promotion,
      from: this.obj,
      into,
      where,
    };
  }
}

class TopLayerCaptureApplier<
  Captured,
  A extends Layers.AnyLayer,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
  Feature extends Layers.AccentFeatures<A>,
> implements ITopLayerCaptureApplier<Captured, A, ABCHistory, Feature> {
  constructor(
    private obj: CapturableOr<Captured, A>,
  ) {}

  transform(
    {into, where}: TransformParam<Captured, A, A, ABCHistory, Feature>,
  ): TransformRule<Captured, A, ABCHistory, Feature> {
    return {
      type: TransformType.transformation,
      from: this.obj,
      into,
      where,
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

export class Language<A extends Record<string, Layers.AnyLayer>[]> {
  public readonly layers: OrderedObjOf<A>;

  public rules: Record<string, Record<string, Rule[]>>;

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
  // gotta verify through practice unfortunately), and second that my
  // handmade mapped types know more than the type inference below would
  constructor(...abcs: $<A>) {
    this.abcs = Object.assign({}, ...abcs);
    this.layers = abcs.map(o => Object.entries(o)) as any;
    this.rules = Object.fromEntries(this.layers.map(name => [name, {}]));
    this.select = Object.fromEntries(
      this.layers.map(([layer, alphabet], idx) => [
        layer,
        idx < this.layers.length - 1
          ? (createRules: CaptureFuncs<any, any, []>) => {
            const rules = this.rules[layer];
            const nextAlphabet = this.layers[idx + 1]?.[1];
            const capture = Object.assign(
              (obj: Partial<any> = {}) => new CaptureApplier<any, any, any, [], any>(obj),
              Object.fromEntries(alphabet.types.forEach((type: string) => [
                type,
                (obj: Partial<any> = {}) => new CaptureApplier<any, any, any, [], any>({...obj, type}),
              ])),
            );
            Object.entries(createRules).forEach(([feature, createRule]) => {
              if (createRule === undefined) {
                // will literally never happen
                throw new Error(`I was wrong it happened`);
              }
              if (rules[feature] === undefined) {
                rules[feature] = [];
              }
              rules[feature].push(...createRule(capture, alphabet, nextAlphabet));
            });
          }
          : (createRules: TopLayerCaptureFuncs<any, []>) => {
              const rules = this.rules[layer];
              const capture = Object.assign(
                (obj: Partial<any> = {}) => new TopLayerCaptureApplier<any, any, [], any>(obj),
                Object.fromEntries(alphabet.types.forEach((type: string) => [
                  type,
                  (obj: Partial<any> = {}) => new TopLayerCaptureApplier<any, any, [], any>({...obj, type}),
                ])),
              );
              Object.entries(createRules).forEach(([feature, createRule]) => {
                if (createRule === undefined) {
                  // will literally never happen
                  throw new Error(`I was wrong it happened`);
                }
                if (rules[feature] === undefined) {
                  rules[feature] = [];
                }
                rules[feature].push(...createRule(capture, alphabet));
              });
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
