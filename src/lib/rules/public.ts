import {Alphabet} from '../alphabet';
import {extractDefaults, operations, processPack, unfuncSpec} from './funcs';
import {Specs} from './types/environment';
import {ProcessPack, ExtractDefaults} from './types/finalize';
import {PackRulesets, CreateRuleset, Rules, JoinSpecs} from './types/func';
import {Packed, Ruleset, RulesetWrapper, UnfuncSpec} from './types/helpers';

export function rulePack<
  const Source extends Alphabet,
  const Target extends Alphabet,
  const Dependencies extends ReadonlyArray<Alphabet>,
  const Spec extends Specs<Source, Target, Dependencies>,
>(
  source: Source,
  target: Target,
  dependencies: Dependencies,
  spec: Spec
): {
  pack: PackRulesets<UnfuncSpec<Spec>, Source, Target, Dependencies>,
  source: Source,
  target: Target,
  dependencies: Dependencies
} & CreateRuleset<Source, Target, Dependencies, UnfuncSpec<Spec>>
{
  const evaluatedSpecs = unfuncSpec(spec, source, target, dependencies) as UnfuncSpec<Spec>;
  return Object.assign(
    ((extraSpec, targets, constraints) => {
      const evaluatedExtraSpecs = unfuncSpec(extraSpec, source, target, dependencies);
      const combinedSpecs = {
        match: `all`,
        value: [evaluatedSpecs, evaluatedExtraSpecs],
      } as const;
      const evaluatedTargets = targets instanceof Function
        ? targets(operations(source, target, dependencies))
        : targets as Exclude<typeof targets, (...args: never) => unknown>;
      return {
        rules: Object.fromEntries(
          // avoiding an excessively deep etc error
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(evaluatedTargets as any).map(([name, v]) => [
            name,
            {
              // I think it doesn't want it to be double-unfuncked in the type system
              // just messy
              // but if i'm wrong i'll find out at runtime lol
              for: combinedSpecs,  // unknown as JoinSpecs<[UnfuncSpec<Spec>, typeof extraSpec]>
              into: v,
            },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ]) as any  // idk why
        ) as Rules<typeof targets, Source, Target, JoinSpecs<[UnfuncSpec<Spec>, typeof extraSpec]>, Dependencies>,
        constraints,
      };
    }) as CreateRuleset<Source, Target, Dependencies, UnfuncSpec<Spec>>,
    {
      pack: rulesets => ({
        children: rulesets,
        specs: evaluatedSpecs,
        source,
        target,
        dependencies,
        /* Excessive stack depth comparing types 'MatchInstance<"any", readonly (SpecsNoMatch<Source, Target, Dependencies, never> | MatchSchemaOf<SpecsNoMatch<Source, Target, Dependencies, never>>)[]>' and '{ readonly match: "any"; readonly value: readonly MatchSchema[]; }'.ts(2321) */
        // __SPECS_FOR_TYPE_CHECK: null as MatchAsType<Spec>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        __SPECS_FOR_TYPE_CHECK: null as any,
      }),
      source,
      target,
      dependencies,
    } as {
      pack: PackRulesets<UnfuncSpec<Spec>, Source, Target, Dependencies>,
      source: Source,
      target: Target,
      dependencies: Dependencies
    }
  );
}

export function finalize<
  const RulePack extends Packed<
    | Record<string, Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
    | RulesetWrapper<Record<string, Ruleset>, Record<string, Record<string, unknown>>>>,
    unknown,
    unknown,
    Alphabet,
    Alphabet,
    ReadonlyArray<Alphabet>
  >,
>(pack: RulePack): ProcessPack<RulePack> & {defaults: ExtractDefaults<RulePack>} {
  return {
    ...processPack(pack),
    defaults: extractDefaults(pack),
  };
}

export function separateContext<
  const Item extends Record<string, unknown>,
  const ContextKeys extends ReadonlyArray<keyof Item>
>(item: Item, ...contextKeys: ContextKeys): {
  features: Omit<Item, ContextKeys[number]>,
  context: Pick<Item, ContextKeys[number]>
} {
  return {
    // so efficient
    features: Object.fromEntries(
      Object.entries(item).filter(
        ([k]) => !contextKeys.includes(k)
      )
    ) as Omit<Item, ContextKeys[number]>,
    context: Object.fromEntries(
      Object.entries(item).filter(
        ([k]) => contextKeys.includes(k)
      )
    ) as Pick<Item, ContextKeys[number]>,
  };
}
