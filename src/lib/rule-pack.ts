// things to consider:
// (..., {consonant}) => consonant({match: `custom`, value: test => test.articulator === `lips`})
// you can't do a custom match that takes features and context at the same time rn
// ...however you can just not do a function and instead go {
//   match: `custom`,
//   value: bruh => bruh.type === `consonant` && bruh.features.articulator === `lips` && bruh.context...
// }
// it's uglier but since it's still doable i think it's ok
import {Alphabet, MembersWithContext} from "./alphabet";
import {EnvironmentFunc, Specs} from "./environment";
import {MatchInstance} from "./utils/match";
import {underlying} from "/languages/levantine/alphabets";

type NestedRecord<T> = {[key: string]: T | NestedRecord<T>};

function rulePack<
  const Source extends Alphabet,
  const Target extends Alphabet,
  const Dependencies extends ReadonlyArray<Alphabet>,
  const Spec extends Specs<Source>,
>(
  source: Source,
  target: Target,
  dependencies: Dependencies,
  spec: Spec
): {
  pack<const R extends Record<
    string,
    any
  >>(r: R): R
  <
    const ExtraSpec extends Specs<Source>,
    const Targets extends NestedRecord<ReadonlyArray<MembersWithContext<Target>>>,
    const Constraints extends Record<string, EnvironmentFunc<Source, Dependencies>>
  >(
    extraSpec: ExtraSpec,
    targets: Targets,
    constraints?: Constraints
  ): {
    targets: {
      [K in keyof Targets]: {
        name: K,
        for: MatchInstance<`all`, [Spec, ExtraSpec]>,
        into: Targets[K]
      }
    }
    constraints: Constraints
  },
} {
  return null as any;
}

const test = rulePack(underlying, underlying, [underlying], {});

const what = test({
  spec: {context: {affected: true}},
  env: (where, segment) => where.before(segment(context => context.affected())),
},
{
  woah: [{type: `consonant`, features: {} as any}],
},
{
  beforeA: ({before}, {consonant, vowel}, {affected}) => (
    before(
      consonant(),
      consonant({match: `custom`, value: test => test.articulator === `lips`}),
      vowel(features => features.round())
    )
  ),
},
);

const what2 = test({
  spec: {context: {affected: true}},
  env: {next: [{type: `consonant`, features: {emphatic: true}}]},
},
{
  woah: {test: [{type: `consonant`, features: {} as any}]},
},
{
  beforeA: ({before}, {consonant, vowel}, {affected}) => (
    before(
      consonant(features => features.articulator.lips),
      vowel(features => features.backness.back)
    )
  ),
});

const what3 = test({
  spec: {context: {affected: true}},
  env: {next: [{type: `consonant`, features: {emphatic: true}}]},
},
{
  base: {
    etc: [{type: `consonant`, features: {} as any}],
  },
},
{
  beforeA: ({before}, {consonant, vowel}, {affected}) => (
    {
      was: {underlying: {spec: `consonant`}},
    }
  ),
});
