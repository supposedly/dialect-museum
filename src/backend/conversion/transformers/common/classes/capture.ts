/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import {A, Any, List, Union} from 'ts-toolbelt';
import * as ABC from '../../../alphabets/common';
import * as Accents from '../../../accents/common';
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
  Force,
  NextMappedFuncs,
  CaptureFuncs,
  Rule,
  TransformRule,
  PromoteRule,
  TransformParam,
  InputMatchSpec,
  MatchSpec,
} from './capture-types';
import {DeepMatchOr, Match, Matcher, MatchOr} from '../match';

type MatchSpecOf<M extends InputMatchSpec<ABC.AnyAlphabet, OrderedObj<string, ABC.AnyAlphabet>>> =
  M extends InputMatchSpec<infer A, infer O> ? MatchSpec<A, O> : never;

type CursedFix<T> = T extends Match<DeepMatchOr<infer E>> ? DeepMatchOr<E> : T;
type Bruh<T> = T extends Match<infer U> ? Match<U> : T;

function transformMatchSpec<
  M extends MatchOr<InputMatchSpec<
    ABC.AnyAlphabet,
    OrderedObj<string, ABC.AnyAlphabet>
  >>,
>(name: string, where: M): MatchSpecOf<M> {
  if (where instanceof Match) {
    const reassignToHelpTS = where;
    if (Array.isArray(reassignToHelpTS.original)) {
      return new (
        where.constructor as {new(a: typeof reassignToHelpTS.original): MatchSpecOf<M>}
      )(reassignToHelpTS.original.map(value => transformMatchSpec(name, value)));
    }
    return new (
      where.constructor as {new(a: typeof reassignToHelpTS.original): MatchSpecOf<M>}
    )(transformMatchSpec(name, reassignToHelpTS.original));
  }

  const ret = {
    next: [] as MatchSpecOf<M>[`next`],
    prev: [] as MatchSpecOf<M>[`prev`],
    was: `was` in where ? where.was as MatchSpecOf<M>[`was`] : undefined,
  } as MatchSpecOf<M>;

  Object.entries(where).forEach(([k, v]) => {
    if (v === undefined) {
      return;
    }
    if ((k.startsWith(`next`) && k !== `next`) || (k.startsWith(`prev`) && k !== `prev`)) {
      const direction = k.slice(0, 4) as `next` | `prev`;

      if (v instanceof Match) {
        if (Array.isArray(v.original)) {
          const ts = v.original;
          ret[direction]?.push(new (
            v.constructor as {new(a: typeof ts): Exclude<MatchSpecOf<M>[typeof direction], undefined>}
          )(
            v.original.map(value => ({
              matching: {type: `${name}:${k.slice(4).toLowerCase()}`},
              spec: value?.spec,
              env: value?.env,
            })),
          ) as any);  // XXX: idk man
        } else {
          const ts = v.original;
          ret[direction]?.push(new (
            v.constructor as {new(a: typeof ts): Exclude<MatchSpecOf<M>[typeof direction], undefined>}
          )({
            matching: {type: `${name}:${k.slice(4).toLowerCase()}`},
            spec: `spec` in v.original ? v.original.spec : undefined,
            env: `env` in v.original ? v.original.env : undefined,
          }) as any);
        }
        return;
      }
      ret[direction]?.push({
        matching: {type: `${name}:${k.slice(4).toLowerCase()}`},
        spec: `spec` in v ? v.spec : undefined,
        env: `env` in v ? transformMatchSpec(name, v.env as any) : undefined,
      });
    }
  });

  return ret;
}

class CaptureApplier<
  Captured,
  A extends Accents.AnyLayer,
  B extends ABC.AnyAlphabet,
  ABCHistory extends OrderedObj<string, ABC.AnyAlphabet>,
  Feature extends Accents.AccentFeatures<A>,
> implements ICaptureApplier<Captured, A, B, ABCHistory, Feature> {
  constructor(
    private name: string,
    private obj: CapturableOr<Captured, A>,
  ) {}

  transform(
    {into, where, order = {}}: TransformParam<Captured, A, A, ABCHistory, Feature>,
  ): TransformRule<Captured, A, ABCHistory, Feature> {
    return {
      type: TransformType.transformation,
      from: this.obj,
      into,
      where: transformMatchSpec(this.name, where as any) as any,
      order,
    };
  }

  promote(
    {into, where, order = {}}: TransformParam<Captured, A, B, ABCHistory, Feature>,
  ): PromoteRule<Captured, A, B, ABCHistory, Feature> {
    return {
      type: TransformType.promotion,
      from: this.obj,
      into,
      where: transformMatchSpec(this.name, where as any) as any,
      order,
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

export class Language<A extends Record<string, Accents.AnyLayer>[]> {
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
            (obj: Partial<any> = {}) => new CaptureApplier<any, any, any, [], any>(layer, obj),
            Object.fromEntries(alphabet.types.forEach((type: string) => [
              type,
              (obj: Partial<any> = {}) => new CaptureApplier<any, any, any, [], any>(layer, {...obj, type}),
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
