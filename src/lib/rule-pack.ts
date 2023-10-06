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

type Ruleset = {
  name: string,
  for: unknown,
  into: NestedRecordOr<ReadonlyArray<unknown>>
}

type RulesetWrapper<
  Rules extends Record<string, Ruleset>,
  Constraints extends Record<string, (...args: never) => unknown>
> = {
  rules: Rules,
  constraints: Constraints
};

type DefaultWrapper = RulesetWrapper<Record<string, Ruleset>, Record<string, (...args: never) => unknown>>;

type Packed<R extends Record<
  string,
  unknown
>, Spec> = {
  children: R
  specs: Spec
};

type RuleFuncs<Wrapper extends RulesetWrapper<Record<string, Ruleset>, Record<string, ((...args: never) => unknown)>>> = {
  [K in keyof Wrapper[`rules`]]: // is this right lol u need both the record stuff and the callable part
  unknown
};

type ProcessPack<RulePack extends Packed<Record<string, unknown>, unknown>> = {
  [K in keyof RulePack]: RulePack[K] extends RulesetWrapper<infer Targets, infer Constraints>
    ? RuleFuncs<RulesetWrapper<
      {
        [T in keyof Targets]: {
          name: Targets[T][`name`]
          for: MatchInstance<`all`, readonly [Targets[T][`for`], RulePack[`specs`]]>,
          into: Targets[T][`into`]
        }
      },
      Constraints
    >>
    : RulePack[K] extends Packed<Record<string, unknown>, unknown> ? ProcessPack<RulePack[K]>
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
      | RulesetWrapper<Record<string, Ruleset>, Record<string, ((...args: never) => unknown)>>
      | Packed<Record<string, unknown>, Spec>
    >
  >(r: R): Packed<R, Spec>
  <
    const ExtraSpec extends Specs<Source>,
    const Targets extends NestedRecord<ReadonlyArray<MembersWithContext<Target>>>,
    const Constraints extends Record<string, EnvironmentFunc<Source, Dependencies>>
  >(
    extraSpec: ExtraSpec,
    targets: Targets,
    constraints?: Constraints
  ): RulesetWrapper<
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
const test2 = rulePack(underlying, underlying, [underlying], {spec: {context: {affected: true}}});

const what = test2({
  spec: {context: {affected: true}},
  env: (where, segment) => where.before(segment({affected: true})),
},
{
  woah: {etc: [{type: `consonant`, features: {} as any}]},
},
{
  beforeA: ({before}, {consonant, vowel}, {affected}) => (
    // {env: {next: [{type: `consonant`}, {type: `consonant`, features: {match: `custom`, value: test => test.articulator === `lips`}}, {type: `vowel`, features: {round: true}}]}}
    before(
      consonant(),
      consonant({match: `custom`, value: test => test.articulator === `lips`}),
      vowel({round: true})
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
    // {env: {next: [{type: `consonant`, features: {articulator: `lips`}}, {type: `vowel`, features: {backness: `back`}}]}}
    before(
      consonant({articulator: `lips`}),
      vowel({backness: `back`})
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

type Wat = typeof what;

const wat = what;

const eee = what.rules.woah.for;

const bruv = test2.pack({what});
type Waft = typeof bruv[`children`][`what`][`rules`][`woah`][`into`];
const bruh = test.pack({what2, bruv});
