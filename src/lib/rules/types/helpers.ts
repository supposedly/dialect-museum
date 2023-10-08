import {MatchInstance} from "/lib/utils/match";
import {Merge, NestedRecord, NestedRecordOr} from "/lib/utils/typetools";

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
  Constraints extends Record<string, (...args: never) => unknown>
> = {
  rules: Rules,
  constraints: Constraints
};

export type Unfunc<T, Key extends string> = T extends {[K in Key]: (...args: never) => unknown}
  ? ReturnType<T[Key]>
  : T extends {[K in Key]: {match: unknown, value: readonly unknown[]}}
  ? {match: T[Key][`match`], value: {[Index in keyof T[Key][`value`]]: Unfunc<T[Key][`value`][Index], Key>}}
  : T extends {[K in Key]: unknown}
  ? {[K in Key]: T[Key]}
  : T extends {match: unknown, value: readonly unknown[]}
  ? {match: T[`match`], value: {[Index in keyof T[`value`]]: Unfunc<T[`value`][Index], Key>}}
  : never;

export type UnfuncSpec<Spec> = Spec extends ({spec: unknown, env?: unknown} | {spec: unknown})
  ? Merge<Unfunc<Spec, `spec`>, Unfunc<Spec, `env`>>
  : Spec extends {match: unknown, value: readonly unknown[]}
  ? {match: Spec[`match`], value: {[Index in keyof Spec[`value`]]: UnfuncSpec<Spec[`value`][Index]>}}
  : Spec;

export type Packed<R extends Record<
  string,
  unknown
>, Spec> = {
  children: R
  specs: UnfuncSpec<Spec>
};

type IntoToFunc<
  Into extends NestedRecordOr<ReadonlyArray<unknown>>,
  Spec
> = Into extends ReadonlyArray<unknown>
  ? (odds?: number) => ({for: UnfuncSpec<Spec>, into: Into})
  : Into extends NestedRecord<ReadonlyArray<unknown>> ? {[K in keyof Into]: IntoToFunc<Into[K], Spec>}
  : never;

export type RulesetToFunc<Rules extends Record<string, Ruleset>> = {
  [K in keyof Rules]: IntoToFunc<
    Rules[K][`into`],
    UnfuncSpec<Rules[K][`for`]>
  >
};

export type ConstraintsToFuncs<Constraints extends Record<string, ((...args: never) => unknown)>> = {
  [K in keyof Constraints]: <
    const Arr extends ReadonlyArray<({for: unknown, into: unknown})>
  >(...args: Arr) => {
    [Index in keyof Arr]: {
      for: MatchInstance<`all`, readonly [Arr[Index][`for`], ReturnType<Constraints[K]>]>,
      into: Arr[Index][`into`]}
    }
};
