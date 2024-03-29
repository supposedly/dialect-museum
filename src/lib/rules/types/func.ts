import {RulesetWrapper, Ruleset, Packed, UnfuncSpec, UnfuncTargets} from './helpers';
import {Specs, SpecsNoMatch} from './environment';
import {Alphabet, MembersWithContext, PartialMembersWithContext} from 'src/lib/alphabet';
import {MatchAsType, MatchInstance, SafeMatchSchemaOf} from 'src/lib/utils/match';
import {ArrayOr, Get, NestedArray, NestedRecord, NeverSayNever} from 'src/lib/utils/typetools';

export type PackRulesets<
  in out Spec,
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet>
> = <
  const R extends Record<
    string,
    | RulesetWrapper<Record<string, Ruleset>, Record<string, Record<string, unknown>>>
    | Packed<Record<string, unknown>, MatchAsType<Spec>, unknown, Source, Target, ReadonlyArray<Dependencies[number]>>
  >
>(r: R) => Packed<R, MatchAsType<Spec>, Spec, Source, Target, Dependencies>;

type MatchOrFunction<ABC extends Alphabet, Keys extends `spec` | `env`> = (
  | SafeMatchSchemaOf<Exclude<SpecsNoMatch<ABC, never, [], `target`>[Keys], (...args: never) => unknown>>
  | Extract<SpecsNoMatch<ABC, never, [], `target`>[Keys], (...args: never) => unknown>
);

// i hate this so much lmfao
// (they return never bc trying to incorporate their actual return types into Ruleset ended up opening pandora's
// box on the full and horrifying extent of just how unsound this entire design's type hackery is)
// btw they have to have const generics in order to be inferred const (eg for array length like in root)
export type SpecOperations<in out Source extends Alphabet, in out Target extends Alphabet, ABCHistory extends ReadonlyArray<Alphabet>> = {
  /** @returns ``{operation: `mock`, arguments: specs}`` */
  mock: (<const M extends ReadonlyArray<SpecsNoMatch<Source, Target>[`spec`]>>(...specs: M) => never) & {
    was: {
      [ABC in ABCHistory[number] | Source as ABC[`name`]]:
        /** @returns ``{operation: `mock`, arguments: {was: {[the alphabet's name]: specs}}}`` */
        <const M extends ReadonlyArray<SpecsNoMatch<ABC, Target>[`spec`]>>(...specs: M) => never
    }
  }
  /** @returns ``{operation: `preject`, arguments: specs}`` */
  preject<const M extends ReadonlyArray<SpecsNoMatch<Target, never, [], `target`>[`spec`]>>(...spec: M): never
  /** @returns ``{operation: `postject`, arguments: specs}`` */
  postject<const M extends ReadonlyArray<SpecsNoMatch<Target, never, [], `target`>[`spec`]>>(...spec: M): never
  /** Coalesces environment members matching `env` into the currently captured segment
   * to result in `spec`.
   * On the current layer, they will no longer undergo any rule transformations.
   * On the next layer, they will point to the output of the current capture.
   * @returns ``{operation: `coalesce`, arguments: env}``
   */
  coalesce<
    const Spec extends ArrayOr<Exclude<SpecsNoMatch<Target, never, [], `target`>[`spec`], null>>,
    const Env extends MatchOrFunction<Source, `env`>,
  >(
    spec: Spec,
    env?: Env,
  ): never
};

type _IntoSpec<Source extends Alphabet, in out Target extends Alphabet, in out Spec> = NestedRecord<
  | NestedArray<
    | MembersWithContext<Target>
    // | ReturnType<ValuesOf<SpecOperations<Target, ABCHistory>>>
  >
  | ((
    captured: MatchAsType<Spec> extends infer Deferred extends {spec: unknown}
      ? Deferred[`spec`] extends {type: infer T extends keyof Source[`types`], features: unknown}
        ? NeverSayNever<{
          type: T,
          features: MatchAsType<Source[`types`][T]> & Deferred[`spec`][`features`],
          context: Get<Deferred[`spec`], `context`>
        }>
        : Deferred[`spec`]
      : Spec,
    /*
    // not implementing this for now, needs to wait at least until checkEnv() gets reworked
    // (also grabbing {next: {0: {spec: {features: second}}}} out of env in the diphthong rulesets was
    // giving y | {} and w | {} instead of just y and w, have to diagnose)
    environment: MatchAsType<Spec> extends infer Deferred extends {env: unknown}
      ? MatchAsType<Deferred[`env`]>
      : never,
    */
  ) => NestedArray<
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
  const Constraints extends Record<string, Specs<Source, Target, Dependencies>>
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
  Record<string, Specs<Source, Target, Dependencies>> extends Constraints ? Record<never, never> : Constraints
>;
