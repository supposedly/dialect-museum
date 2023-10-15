import {Packed, RulesetWrapper, Ruleset, RulesetToFunc, ConstraintsToFuncs} from "./helpers";
import {Alphabet} from "/lib/alphabet";
import {MatchInstance} from "/lib/utils/match";
import {NestedArray, IsUnion, Merge} from "/lib/utils/typetools";

export type RuleFunc<
  Wrapper extends RulesetWrapper<
    Record<string, Ruleset>,
    Record<string, ((...args: never) => unknown)>
  >,
  R extends NestedArray<Ruleset>
> = (
  item: RulesetToFunc<Wrapper[`rules`]>,
  when: ConstraintsToFuncs<Wrapper[`constraints`]>
) => R;

export type ProcessPack<RulePack extends Packed<Record<string, unknown>, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>> = {
  [K in keyof RulePack[`children`]]: RulePack[`children`][K] extends RulesetWrapper<infer Targets, infer Constraints>
    ? <const R extends NestedArray<Ruleset>>(fn: RuleFunc<RulesetWrapper<
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
    : RulePack[`children`][K] extends Packed<Record<string, unknown>, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
      ? ProcessPack<RulePack[`children`][K]>
    : never
};

type OnlyOneTarget<Into> = Into extends NestedArray<unknown>
  ? true
  : Into extends Record<string, unknown>
  ? IsUnion<keyof Into> extends false ? OnlyOneTarget<Into[keyof Into]> : false
  : false;

type _NonDefaults<out RulePack extends Packed<Record<string, unknown>, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>> = {
  [K in keyof RulePack[`children`]]: RulePack[`children`][K] extends Packed<Record<string, unknown>, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
      ? ProcessPack<RulePack[`children`][K]>
      : never
};
type _Defaults<out RulePack extends Packed<Record<string, unknown>, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>> = {
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

export type ExtractDefaults<RulePack extends Packed<Record<string, unknown>, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>> = Merge<
  _NonDefaults<RulePack>,
  _Defaults<RulePack>
>;
