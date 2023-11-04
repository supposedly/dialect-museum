import {Specs} from './environment';
import {Alphabet} from 'src/lib/alphabet';
import {MatchInstance} from 'src/lib/utils/match';
import {Get, NestedRecord, NestedRecordOr} from 'src/lib/utils/typetools';
import oddsWrapper from '../odds';

export type UnfuncTargets<Targets> = Targets extends (...args: never) => unknown
  ? ReturnType<Targets>
  : Targets extends ReadonlyArray<unknown> ? Targets
  : {[K in keyof Targets]: UnfuncTargets<Targets[K]>};

export type Ruleset = {
  for: unknown,
  into: NestedRecordOr<ReadonlyArray<unknown>>
}

export type RulesetWrapper<
  Rules extends Record<string, Ruleset>,
  Constraints extends Record<string, Record<string, unknown>>
> = {
  rules: Rules,
  constraints: Constraints
};

export type Unfunc<
  T extends object | ((...args: never) => unknown),
  Key extends string
> = T extends {[K in Key]: (...args: never) => unknown}
  ? {[K in Key]: ReturnType<T[Key]>}
  : T extends {[K in Key]: {match: unknown, value: ReadonlyArray<object | ((...args: never) => unknown)>}}
  ? {[K in Key]: {match: T[Key][`match`], value: {
    [Index in keyof T[Key][`value`]]:
      Index extends number
        ? Unfunc<T[Key][`value`][Index], Key>
        : T[Key][`value`][Index]
  }}}
  : T extends {[K in Key]: unknown}
  ? {[K in Key]: T[Key]}
  : T extends {match: unknown, value: ReadonlyArray<object | ((...args: never) => unknown)>}
  ? {match: T[`match`], value: {
    [Index in keyof T[`value`]]:
      Index extends number
        ? Unfunc<T[`value`][Index], Key>
        : T[`value`][Index]
  }}
  : T;

export type UnfuncSpec<Spec> = Spec extends {match: `custom`, value: unknown}
  ? Spec
  : Spec extends ({spec: unknown, env?: unknown} | {env: unknown})
  ? {spec: Get<Unfunc<Spec, `spec`>, `spec`>, env: Get<Unfunc<Spec, `env`>, `env`>} & UnfuncSpec<Omit<Spec, `spec` | `env`>>
  : Spec extends {match: unknown, value: readonly unknown[]}
  ? {match: Spec[`match`], value: {[Index in keyof Spec[`value`]]: UnfuncSpec<Spec[`value`][Index]>}}
  : Spec extends object
  ? {[K in keyof Spec]: UnfuncSpec<Spec[K]>}
  : never;

export type Packed<
  R extends Record<string, unknown>,
  SpecsForTypeCheck,
  Specs,
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet>
> = {
  children: R
  specs: Specs
  source: Source
  target: Target
  dependencies: Dependencies
  __SPECS_FOR_TYPE_CHECK: SpecsForTypeCheck
};

export type IntoToFunc<
  Into,
  Spec
> = Into extends ReadonlyArray<unknown>
  ? (odds?: number | ReturnType<ReturnType<typeof oddsWrapper>>) => {
    for: UnfuncSpec<Spec>
    into: Into
    odds: ReturnType<ReturnType<typeof oddsWrapper>>
  }
  : Into extends Record<string, unknown> ? {[K in keyof Into]: IntoToFunc<Into[K], Spec>}
  : never;

export type RulesetToFunc<Rules extends Record<string, Ruleset>> = {
  [K in keyof Rules]: IntoToFunc<Rules[K][`into`], Rules[K][`for`]>
};

export type ConstraintsToFuncs<Constraints extends Record<
  string,
  Record<string, unknown>//((...args: never) => unknown) | Record<string, unknown>>
>, Source extends Alphabet, Target extends Alphabet, Dependencies extends ReadonlyArray<Alphabet>> = {
  [K in keyof Constraints]: {
    // rip
    negated<
      const Arr extends ReadonlyArray<({for: unknown, into: unknown})>
    >(...args: Arr): {
      [Index in keyof Arr]: {
        for: MatchInstance<`custom`, (...args: ReadonlyArray<unknown>) => boolean>,
        into: Arr[Index][`into`]
      }
    }
    <
      const Arr extends ReadonlyArray<({for: unknown, into: unknown})>
    >(...args: Arr): {
      [Index in keyof Arr]: {
        for: MatchInstance<`all`, readonly [
          Arr[Index][`for`],
          UnfuncSpec<Constraints[K]>
        ]>,
        into: Arr[Index][`into`]
      }
    }
  }
} & {
  custom: <
    const Spec extends Specs<Source, Target, Dependencies>,
    const Arr extends ReadonlyArray<{for: unknown, into: unknown}>
  >(
    spec: Spec,
    ...args: Arr
  ) => {
    [Index in keyof Arr]: {
      for: MatchInstance<`all`, readonly [
        Arr[Index][`for`],
        UnfuncSpec<Spec>
      ]>,
      into: Arr[Index][`into`]
    }
  }
};
