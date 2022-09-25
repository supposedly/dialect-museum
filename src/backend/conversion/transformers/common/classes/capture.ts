/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import * as ABC from '../../../alphabets/common';
import * as Layers from '../../../layers/common';
import {Narrow as $} from '../../../utils/typetools';
import {TrackerList} from './tracker';
import {
  OrderedObj,
  OrderedObjOf,
  MergeObjs,
} from '../type';
import {
  CaptureApplier as ICaptureApplier,
  CapturableOr,
  Force,
  NextMappedFuncs,
  CaptureFuncs,
  Rule,
  TransformRule,
  PromoteRule,
  TransformParam,
  InputMatchSpec,
  MatchSpec,
  MatchSpecEnvEntry,
  AnyInputMatchSpec,
  TransformType,
  Direction,
} from './capture-types';
import {DeepMatchOr, Match} from '../match';

function transformEnvEntry(
  layer: string,
  direction: Direction,
  target: string,
  constraints: DeepMatchOr<{spec: {}, env: AnyInputMatchSpec}>,
): MatchSpecEnvEntry {
  if (constraints instanceof Match) {
    if (Array.isArray(constraints.original)) {
      return new (constraints.constructor as {new(...arg: unknown[]): ReturnType<typeof transformEnvEntry>})(
        ...constraints.original.map(value => transformEnvEntry(layer, direction, target, value)),
      );
    }
    return new (constraints.constructor as {new(...arg: unknown[]): ReturnType<typeof transformEnvEntry>})(
      transformEnvEntry(layer, direction, target, constraints.original),
    );
  }

  const ret = {
    direction,
    target: target ? {type: `${layer}:${target}`} : {},
    spec: constraints.spec,
  };

  if (constraints.env instanceof Match) {
    if (Array.isArray(constraints.env.original)) {
      return {
        ...ret,
        env: new (constraints.env.constructor as {new(...arg: unknown[]): MatchSpecOf<AnyInputMatchSpec>})(
          // the `as any[]` is an escape hatch -- without it typescript dies bc excessive stack depth comparing types
          ...(constraints.env.original as any[]).map(value => transformMatchSpec(layer, value)),
        ),
      };
    }
    return {
      ...ret,
      env: new (constraints.env.constructor as {new(...arg: unknown[]): MatchSpecOf<AnyInputMatchSpec>})(
        transformMatchSpec(layer, constraints.env.original),
      ),
    };
  }
  return {
    ...ret,
    env: constraints.env === undefined
      ? {env: [], was: {}}
      : transformMatchSpec(layer, constraints.env),
  };
}

type MatchSpecOf<M extends AnyInputMatchSpec> =
  M extends InputMatchSpec<infer A, infer O> ? MatchSpec<A, O> : never;

function transformMatchSpec<
  M extends InputMatchSpec<
    ABC.AnyAlphabet,
    OrderedObj<string, ABC.AnyAlphabet>
  >,
>(layer: string, where: M): MatchSpecOf<M> {
  if (where instanceof Match) {
    const original = where.original;
    if (Array.isArray(original)) {
      return new (where.constructor as {new(...arg: unknown[]): MatchSpecOf<M>})(
        ...original.map(value => transformMatchSpec(layer, value)),
      );
    }
    return new (where.constructor as {new(arg: unknown): MatchSpecOf<M>})(
      transformMatchSpec(layer, original),
    );
  }

  return {
    was: where.was,
    env: Object.entries(where)
      .filter(
        ([k, v]) => v && (k.startsWith(`next`) || k.startsWith(`prev`)),
      ).map(([k, v]) => transformEnvEntry(
        layer,
        k.slice(0, 4) as Direction,
        k.slice(4).toLowerCase(),
        v!,
      )),
  } as MatchSpecOf<M>;
}

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
        (createRules: CaptureFuncs<any, any, []>) => {
          const rules = this.rules[layer];
          const nextAlphabet = this.layers[idx + 1]?.[1];
          const capture = Object.assign(
            (obj: Partial<any> = {}) => new CaptureApplier<any, any, any, [], any>(obj),
            Object.fromEntries(alphabet.types.forEach((type: string) => [
              type,
              (obj: Partial<any> = {}) => new CaptureApplier<any, any, any, [], any>({...obj, type}),
            ])),
          );
          Object.entries(createRules).forEach(([accent, createRule]) => {
            if (createRule === undefined) {
              // will literally never happen
              throw new Error(`I was wrong it happened`);
            }
            if (rules[accent] === undefined) {
              rules[accent] = [];
            }
            rules[accent].push(...createRule(capture, alphabet, nextAlphabet));
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
