import {RulesetWrapper, Ruleset, Packed, UnfuncSpec, UnfuncTargets} from "./helpers";
import {Specs, SpecsNoMatch, EnvironmentFunc} from "./environment";
import {Alphabet, MembersWithContext, PartialMembersWithContext} from "/lib/alphabet";
import {MatchAsType, MatchInstance, SafeMatchSchemaOf} from "/lib/utils/match";
import {Get, MergeIntersection, NestedRecord, NeverSayNever} from "/lib/utils/typetools";

export type PackRulesets<in out Spec, Source extends Alphabet, Target extends Alphabet, Dependencies extends ReadonlyArray<Alphabet>> = <const R extends Record<
    string,
    | RulesetWrapper<Record<string, Ruleset>, Record<string, ((...args: never) => unknown)>>
    | Packed<Record<string, unknown>, Spec, Source, Target, Dependencies>
  >
>(r: R) => Packed<R, Spec, Source, Target, Dependencies>;

type MatchOrFunction<ABC extends Alphabet, Keys extends `spec` | `env`> = (
  | SafeMatchSchemaOf<Exclude<SpecsNoMatch<ABC, never, [], `target`>[Keys], (...args: never) => unknown>>
  | Extract<SpecsNoMatch<ABC, never, [], `target`>[Keys], (...args: never) => unknown>
);

// i hate this so much lmfao
// (they return never bc trying to incorporate their actual return types into Ruleset ended up opening pandora's
// box on the full and horrifying extent of just how unsound this entire design's type hackery is)
export type SpecOperations<in out Source extends Alphabet, in out Target extends Alphabet, ABCHistory extends ReadonlyArray<Alphabet>> = {
  /** @returns ``{operation: `mock`, arguments: specs}`` */
  mock: ((...specs: ReadonlyArray<SpecsNoMatch<Source, Target>[`spec`]>) => never) & {
    was: {
      [ABC in ABCHistory[number] as ABC[`name`]]:
        /** @returns ``{operation: `mock`, arguments: {was: {[the alphabet's name]: specs}}}`` */
        (...specs: ReadonlyArray<SpecsNoMatch<ABC, never, [], `target`>[`spec`]>) => never
    }
  }
  /** @returns ``{operation: `preject`, arguments: specs}`` */
  preject(...spec: ReadonlyArray<SpecsNoMatch<Target, never, [], `target`>[`spec`]>): never
  /** @returns ``{operation: `postject`, arguments: specs}`` */
  postject(...spec: ReadonlyArray<SpecsNoMatch<Target, never, [], `target`>[`spec`]>): never
  /** Coalesces environment members matching `env` into the currently captured segment.
   * On the current layer, they will no longer undergo any rule transformations.
   * On the next layer, they will point to the output of the current capture.
   * @returns ``{operation: `coalesce`, arguments: env}``
   */
  coalesce(env: MatchOrFunction<Source, `env`>): never
};

type _IntoSpec<Source extends Alphabet, in out Target extends Alphabet, in out Spec> = NestedRecord<
  | ReadonlyArray<
    | MembersWithContext<Target>
    // | ReturnType<ValuesOf<SpecOperations<Target, ABCHistory>>>
  >
  | ((
    captured: MatchAsType<Spec> extends infer Deferred extends {spec: unknown}
      ? Deferred[`spec`] extends {type: infer T extends keyof Source[`types`], features: unknown}
        ? NeverSayNever<{
          type: T,
          features: MergeIntersection<MatchAsType<Source[`types`][T]> & Deferred[`spec`][`features`]>,
          context: Get<Deferred[`spec`], `context`>
        }>
        : Deferred[`spec`]
      : Spec,
    environment: MatchAsType<Spec> extends infer Deferred extends {env: unknown}
      ? Deferred[`env`]
      : never,
    // {preject, postject, mock, etc}
  ) => ReadonlyArray<
    | PartialMembersWithContext<Target>
    // | typeof captured
    // | ReturnType<ValuesOf<SpecOperations<Target, ABCHistory, MembersWithContext<Target> | typeof captured>>>
  >)
>;

export type IntoSpec<Source extends Alphabet, Target extends Alphabet, Spec, ABCHistory extends ReadonlyArray<Alphabet>> = (
  | _IntoSpec<Source, Target, Spec>
  | ((operations: SpecOperations<Source, Target, ABCHistory>) => _IntoSpec<Source, Target, Spec>)
);

type _Rules<
  in out Targets extends IntoSpec<Source, Target, Spec, ABCHistory>,
  Source extends Alphabet,
  in out Target extends Alphabet,
  in out Spec,
  in out ABCHistory extends ReadonlyArray<Alphabet>
> = {
  [K in keyof Targets & string]: {
    for: Spec,
    into: UnfuncTargets<Targets>[K]
  }
};

export type Rules<
  Targets extends IntoSpec<Source, Target, Spec, ABCHistory>,
  Source extends Alphabet,
  Target extends Alphabet,
  Spec,
  ABCHistory extends ReadonlyArray<Alphabet>
> = Targets extends (operations: never) => _IntoSpec<Source, Target, Spec>
  ? _Rules<ReturnType<Targets>, Source, Target, Spec, ABCHistory>
  : _Rules<Targets, Source, Target, Spec, ABCHistory>

export type JoinSpecs<in out Specs extends ReadonlyArray<unknown>> = MatchInstance<
  `all`,
  {[Index in keyof Specs]: Record<string, never> extends Specs[Index] ? never : UnfuncSpec<Specs[Index]>}
>;

export type CreateRuleset<
  in Source extends Alphabet,
  in out Target extends Alphabet,
  in out Dependencies extends ReadonlyArray<Alphabet>,
  in out Spec
> = <
  const ExtraSpec extends Specs<Source, Target, Dependencies>,
  const Targets extends IntoSpec<Source, Target, JoinSpecs<[Spec, ExtraSpec]>, Dependencies>,
  const Constraints extends Record<string, EnvironmentFunc<Source, Dependencies>>
>(
  extraSpec: ExtraSpec,
  targets: Targets,
  constraints?: Constraints
) => RulesetWrapper<
  Rules<
    Targets,
    Source,
    Target,
    JoinSpecs<[Spec, ExtraSpec]>,
    Dependencies
  >,
  Constraints
>;
