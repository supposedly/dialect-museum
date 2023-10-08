// things to consider:
// (..., {consonant}) => consonant({match: `custom`, value: test => test.articulator === `lips`})
// you can't do a custom match that takes features and context at the same time rn
// ...however you can just not do a function and instead go {
//   match: `custom`,
//   value: bruh => bruh.type === `consonant` && bruh.features.articulator === `lips` && bruh.context...
// }
// it's uglier but since it's still doable i think it's ok
import {Alphabet} from "/lib/alphabet";
import {Specs} from "/lib/environment";
import {Packed} from "./types/helpers";
import {ExtractDefaults, ProcessPack} from "./types/finalize";
import {CreateRuleset, PackRulesets} from "./types/func";

export function rulePack<
  const Source extends Alphabet,
  const Target extends Alphabet,
  const Dependencies extends ReadonlyArray<Alphabet>,
  const Spec extends Specs<Source>,
>(
  source: Source,
  target: Target,
  dependencies: Dependencies,
  spec: Spec
): {pack: PackRulesets<Spec>} & CreateRuleset<Source, Target, Dependencies, Spec>
{
  return null as any;
}

export function finalize<const RulePack extends Packed<Record<string, unknown>, unknown>>(pack: RulePack): ProcessPack<RulePack> & {
  defaults: ExtractDefaults<RulePack>
} {
  return null as any;
}
