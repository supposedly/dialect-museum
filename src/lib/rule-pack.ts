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
import {MatchInstance, MatchSchema, MatchSchemaOf} from "./utils/match";
import {underlying} from "/languages/levantine/alphabets";

type NestedRecord<T> = {[key: string]: T | NestedRecord<T>};
type NestedRecordOr<T> = T | {[key: string]: NestedRecordOr<T>};

type Rule = {
  name: string,
  for: unknown,
  into: NestedRecordOr<ReadonlyArray<unknown>>
}

type Ruleset<
  Targets extends Record<string, Rule>,
  Constraints
> = {
  targets: Targets,
  constraints: Constraints
};

type Packed<Spec> = {
  [key: string]:
    | Ruleset<Record<string, Rule>, unknown>
    | Packed<Spec>,
} & {spec: Spec};

type ProcessPack<RulePack extends Packed<unknown>> = {
  [K in keyof RulePack]: RulePack[K] extends Ruleset<infer Targets, infer Constraints>
    ? Ruleset<
      {[T in keyof Targets]: {
        name: Targets[T][`name`]
        for: MatchInstance<`all`, readonly [Targets[T][`for`], RulePack[`spec`]]>,
        into: Targets[T][`into`]
      }},
      Constraints
    >
    : RulePack[K] extends Packed<unknown> ? ProcessPack<RulePack[K]>
    : never
}

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
): {
  pack<
    const R extends Record<
      string,
      | Ruleset<Record<string, Rule>, unknown>
      | Packed<Spec>
    >
  >(r: R): Packed<Spec>
  <
    const ExtraSpec extends Specs<Source>,
    const Targets extends NestedRecord<ReadonlyArray<MembersWithContext<Target>>>,
    const Constraints extends Record<string, EnvironmentFunc<Source, Dependencies>>
  >(
    extraSpec: ExtraSpec,
    targets: Targets,
    constraints?: Constraints
  ): Ruleset<
    {
      [K in keyof Targets & string]: {
        name: K,
        for: ExtraSpec,
        into: Targets[K]
      }
    },
    Constraints
  >
} {
  return null as any;
}

function finalize<const RulePack extends Packed<unknown>>(pack: RulePack): ProcessPack<RulePack> {
  return null as any;
}

const test = rulePack(underlying, underlying, [underlying], {spec: {context: {affected: true}}});
const test2 = rulePack(underlying, underlying, [underlying], {spec: {type: `consonant`, context: {affected: true}}});

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

type Wa = typeof what3;

const bruv = test2.pack({what});

const bruh = test.pack({bruv});
