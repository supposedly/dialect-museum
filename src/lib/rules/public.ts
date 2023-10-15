import {Alphabet} from "../alphabet";
import {MatchSchema} from "../utils/match";
import {Merge} from "../utils/typetools";
import {unfuncSpec} from "./funcs";
import {Specs} from "./types/environment";
import {ProcessPack, ExtractDefaults} from "./types/finalize";
import {PackRulesets, CreateRuleset} from "./types/func";
import {Packed, UnfuncSpec} from "./types/helpers";

export function rulePack<
  const Source extends Alphabet,
  const Target extends Alphabet,
  const Dependencies extends ReadonlyArray<Alphabet>,
  const Spec extends Specs<Source, Dependencies>,
>(
  source: Source,
  target: Target,
  dependencies: Dependencies,
  spec: Spec
): {pack: PackRulesets<Spec>} & CreateRuleset<Source, Target, Dependencies, Spec>
{
  const evaluatedSpecs = unfuncSpec(spec, source) as UnfuncSpec<Spec>;
  return Object.assign(
    ((extraSpec, targets, constraints) => {
      const evaluatedExtraSpecs = unfuncSpec(extraSpec, source);
      const combinedSpecs = {
        match: `all`,
        value: [evaluatedSpecs, evaluatedExtraSpecs],
      } as const;
      if (targets instanceof Function) {
        targets = 1;
      }
      return {
        rules: Object.fromEntries(
          Object.entries(targets).map(([k, v]) => [
            k,
            {
              for: combinedSpecs,
              into: v,
            },
          ])
        ),
        constraints,
      };
    }) as CreateRuleset<Source, Target, Dependencies, Spec>,
    {
      pack: rulesets => ({
        children: rulesets,
        specs: evaluatedSpecs,
      }),
    } as {pack: PackRulesets<Spec>}
  );
}

export function finalize<
  const RulePack extends Packed<Record<string, unknown>, unknown>
>(pack: RulePack): ProcessPack<RulePack> & {defaults: ExtractDefaults<RulePack>} {
  return null as any;
}
