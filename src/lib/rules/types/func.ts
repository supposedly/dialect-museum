import {RulesetWrapper, Ruleset, Packed, UnfuncSpec, UnfuncTargets} from "./helpers";
import {Alphabet, MembersWithContext} from "/lib/alphabet";
import {Specs, EnvironmentFunc} from "/lib/environment";
import {MatchAsType, MatchInstance} from "/lib/utils/match";
import {NestedRecord} from "/lib/utils/typetools";

export type PackRulesets<in out Spec> = <const R extends Record<
    string,
    | RulesetWrapper<Record<string, Ruleset>, Record<string, ((...args: never) => unknown)>>
    | Packed<Record<string, unknown>, Spec>
  >
>(r: R) => Packed<R, Spec>;

type IntoSpec<in out Target extends Alphabet, in out Spec> = NestedRecord<
  | ReadonlyArray<
    | MembersWithContext<Target>
    | {type: `preject` | `postject`, value: MembersWithContext<Target>}
    | {type: `eject`, where: {location: `next` | `prev`, index: number}}
  >
  | ((
    captured: MatchAsType<Spec>,
    // {preject, postject, mock, etc}
  ) => ReadonlyArray<MembersWithContext<Target>>)
>;

type Rules<in out Targets extends IntoSpec<Target, Spec>, Target extends Alphabet, in out Spec> = {
  [K in keyof Targets & string]: {
    for: Spec,
    into: UnfuncTargets<Targets>[K]
  }
};

type JoinSpecs<in out Specs extends ReadonlyArray<unknown>> = MatchInstance<
  `all`,
  {[Index in keyof Specs]: UnfuncSpec<Specs[Index]>}
>;

export type CreateRuleset<
  in Source extends Alphabet,
  in Target extends Alphabet,
  in Dependencies extends ReadonlyArray<Alphabet>,
  in out Spec
> = <
  const ExtraSpec extends Specs<Source>,
  const Targets extends IntoSpec<Target, JoinSpecs<[Spec, ExtraSpec]>>,
  const Constraints extends Record<string, EnvironmentFunc<Source, Dependencies>>
>(
  extraSpec: ExtraSpec,
  targets: Targets,
  constraints?: Constraints
) => RulesetWrapper<
  Rules<
    Targets,
    Target,
    JoinSpecs<[Spec, ExtraSpec]>
  >,
  Constraints
>;
