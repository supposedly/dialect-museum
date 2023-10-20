import {Packed, RulesetWrapper, Ruleset, RulesetToFunc, ConstraintsToFuncs, UnfuncSpec} from "./helpers";
import {Alphabet} from "/lib/alphabet";
import {MatchInstance} from "/lib/utils/match";
import {NestedArray, IsUnion} from "/lib/utils/typetools";

export type RuleFunc<
  RulePack extends Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>,
  Wrapper extends RulesetWrapper<
    Record<string, Ruleset>,
    Record<string, Record<string, unknown>>
  >,
  R extends NestedArray<Ruleset>
> = (
  item: RulesetToFunc<Wrapper[`rules`]>,
  when: ConstraintsToFuncs<
    Wrapper[`constraints`],
    RulePack[`source`],
    RulePack[`target`],
    RulePack[`dependencies`]
  >
) => R;

export type ProcessPack<
  RulePack extends Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
> = {
  [K in keyof RulePack[`children`]]: RulePack[`children`][K] extends RulesetWrapper<infer Targets, infer Constraints>
    ? <const R extends NestedArray<Ruleset>>(fn: RuleFunc<RulePack, RulesetWrapper<
      {
        [T in keyof Targets & string]: {
          // name: Targets[T][`name`]
          for: MatchInstance<`all`, readonly [
            Targets[T][`for`],
            RulePack[`specs`],
          ]>,
          into: Targets[T][`into`]
        }
      },
      Constraints
    >, R>) => R
    : RulePack[`children`][K] extends Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
      ? ProcessPack<RulePack[`children`][K]>
    : never
};

type OnlyOneTarget<Into> = Into extends NestedArray<unknown>
  ? true
  : Into extends Record<string, unknown>
  ? IsUnion<keyof Into> extends false ? (true extends OnlyOneTarget<Into[keyof Into]> ? true : false) : false
  : false;

type _NonDefaults<in out RulePack extends Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>> = {
  [K in keyof RulePack[`children`]]: RulePack[`children`][K] extends Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
      ? ProcessPack<RulePack[`children`][K]>
      : never
};
type _Defaults<out RulePack extends Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>> = {
  [K in keyof RulePack[`children`]]: RulePack[`children`][K] extends RulesetWrapper<infer Targets, infer Constraints>
  ? keyof Constraints extends never ? {
    [T in keyof Targets]: 
      OnlyOneTarget<Targets[T][`into`]> extends true ?
        RulesetToFunc<Record<T, {
          for: MatchInstance<`all`, readonly [Targets[T][`for`], RulePack[`specs`]]>
          into: Targets[T][`into`]
        }>>[T]
      : never
    } : never : never
}

export type ExtractDefaults<RulePack extends Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>> = {
  [K in keyof RulePack[`children`]]:
    RulePack[`children`][K] extends RulesetWrapper<infer Targets, infer Constraints>
      ? keyof Constraints extends never
        ? {
          [T in keyof Targets]: 
            OnlyOneTarget<Targets[T][`into`]> extends true
              ? RulesetToFunc<Record<T, {
                for: MatchInstance<`all`, readonly [Targets[T][`for`], RulePack[`specs`]]>
                into: Targets[T][`into`]
              }>>[T]
              : never
          }
        : never
    : RulePack[`children`][K] extends Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
      ? ExtractDefaults<RulePack[`children`][K]>
    : never
};
