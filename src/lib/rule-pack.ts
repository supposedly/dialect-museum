// things to consider:
// (..., {consonant}) => consonant({match: `custom`, value: test => test.articulator === `lips`})
// you can't do a custom match that takes features and context at the same time rn
// ...however you can just not do a function and instead go {
//   match: `custom`,
//   value: bruh => bruh.type === `consonant` && bruh.features.articulator === `lips` && bruh.context...
// }
// it's uglier but since it's still doable i think it's ok
import {Alphabet, MembersWithContext} from "./alphabet";
import {EnvironmentFunc, NestedArray, Specs} from "./environment";
import {MatchAsType, MatchInstance, MatchSchema, MatchSchemaOf} from "./utils/match";
import {IsUnion, Merge, ValuesOf} from "./utils/typetools";
import {underlying} from "/languages/levantine/alphabets";

type NestedRecord<T> = {[key: string]: T | NestedRecord<T>};
type NestedRecordOr<T> = T | {[key: string]: NestedRecordOr<T>};

type Ruleset = {
  // name: string,
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

type Unfunc<T, Key extends string> = T extends {[K in Key]: (...args: never) => unknown}
  ? ReturnType<T[Key]>
  : T extends {[K in Key]: {match: unknown, value: readonly unknown[]}}
  ? {match: T[Key][`match`], value: {[Index in keyof T[Key][`value`]]: Unfunc<T[Key][`value`][Index], Key>}}
  : T extends {[K in Key]: unknown}
  ? {[K in Key]: T[Key]}
  : T extends {match: unknown, value: readonly unknown[]}
  ? {match: T[`match`], value: {[Index in keyof T[`value`]]: Unfunc<T[`value`][Index], Key>}}
  : never;

type UnfuncSpec<Spec> = Spec extends ({spec: unknown, env?: unknown} | {spec: unknown})
  ? Merge<Unfunc<Spec, `spec`>, Unfunc<Spec, `env`>>
  : Spec extends {match: unknown, value: readonly unknown[]}
  ? {match: Spec[`match`], value: {[Index in keyof Spec[`value`]]: UnfuncSpec<Spec[`value`][Index]>}}
  : Spec;

type Packed<R extends Record<
  string,
  unknown
>, Spec> = {
  children: R
  specs: UnfuncSpec<Spec>
};

type IntoToFunc<
  Into extends NestedRecordOr<ReadonlyArray<unknown>>,
  Spec
> = Into extends ReadonlyArray<unknown>
  ? (odds: number) => ({for: UnfuncSpec<Spec>, into: Into})
  : Into extends NestedRecord<ReadonlyArray<unknown>> ? {[K in keyof Into]: IntoToFunc<Into[K], Spec>}
  : never;
type RulesetToFunc<Rules extends Record<string, Ruleset>> = {
  [K in keyof Rules]: IntoToFunc<
    Rules[K][`into`],
    UnfuncSpec<Rules[K][`for`]>
  >
};

type ConstraintsToFuncs<Constraints extends Record<string, ((...args: never) => unknown)>> = {
  [K in keyof Constraints]: <
    const Arr extends ReadonlyArray<({for: unknown, into: unknown})>
  >(...args: Arr) => {
    [Index in keyof Arr]: {
      for: MatchInstance<`all`, readonly [Arr[Index][`for`], ReturnType<Constraints[K]>]>,
      into: Arr[Index][`into`]}
    }
};

type RuleFunc<
  Wrapper extends RulesetWrapper<
    Record<string, Ruleset>,
    Record<string, ((...args: never) => unknown)>
  >,
  R extends NestedArray<Ruleset>
> = (
  item: RulesetToFunc<Wrapper[`rules`]>,
  when: ConstraintsToFuncs<Wrapper[`constraints`]>
) => R;

type ProcessPack<RulePack extends Packed<Record<string, unknown>, unknown>> = {
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
    : RulePack[`children`][K] extends Packed<Record<string, unknown>, unknown> ? ProcessPack<RulePack[`children`][K]>
    : never
};

type OnlyOneTarget<Targets> = Targets extends ReadonlyArray<Ruleset>
  ? true
  : Targets extends Record<string, unknown>
  ? IsUnion<keyof Targets> extends false ? OnlyOneTarget<Targets[string]> : false
  : false;
type GetOneTarget<Targets> = Targets extends NestedArray<Ruleset>
  ? Targets
  : Targets extends Record<string, unknown>
  ? IsUnion<keyof Targets> extends false ? GetOneTarget<Targets[string]> : never
  : never;

type ExtractDefaults<RulePack extends Packed<Record<string, unknown>, unknown>> = Merge<
  {
    [K in keyof RulePack[`children`]]: RulePack[`children`][K] extends Packed<Record<string, unknown>, unknown>
      ? ProcessPack<RulePack[`children`][K]>
      : never
  },
  {
    [K in keyof RulePack[`children`]]: RulePack[`children`][K] extends RulesetWrapper<infer Targets, infer Constraints>
      ? keyof Constraints extends never ? OnlyOneTarget<Targets> extends true ?
        RuleFunc<
          RulesetWrapper<
            {[T in keyof Targets]: {
              for: MatchInstance<`all`, readonly [Targets[T][`for`], RulePack[`specs`]]>
              into: Targets[T][`into`]
            }},
            Constraints
          >,
          GetOneTarget<Targets>
        >
      : never : never : never;
  }
>;

type UnfuncTargets<Targets> = Targets extends (...args: never) => unknown
  ? ReturnType<Targets>
  : Targets extends ReadonlyArray<unknown> ? Targets
  : {[K in keyof Targets]: UnfuncTargets<Targets[K]>};

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
    const Targets extends NestedRecord<
      | ReadonlyArray<MembersWithContext<Target>>
      | ((
        captured: MatchAsType<MatchInstance<`all`, readonly [UnfuncSpec<Spec>, UnfuncSpec<ExtraSpec>]>>,
        // {preject, postject, mock, etc}
      ) => ReadonlyArray<MembersWithContext<Target>>)
    >,
    const Constraints extends Record<string, EnvironmentFunc<Source, Dependencies>>
  >(
    extraSpec: ExtraSpec,
    targets: Targets,
    constraints?: Constraints
  ): RulesetWrapper<
    {
      [K in keyof Targets & string]: {
        // name: K,
        for: UnfuncSpec<ExtraSpec>,
        into: UnfuncTargets<Targets>[K]
      }
    },
    Constraints
  >
} {
  return null as any;
}

// need to add defaults, maybe null
function finalize<const RulePack extends Packed<Record<string, unknown>, unknown>>(pack: RulePack): ProcessPack<RulePack> {
  return null as any;
}

const test = rulePack(underlying, underlying, [underlying], {spec: {context: {affected: true}}});
const test2 = rulePack(underlying, underlying, [underlying], {spec: {context: {affected: true}}});

const what = test2({
  spec: {context: {affected: true}},
  env: (where, segment) => where.before(segment({affected: false})),
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
      vowel(features => features.round()),
      vowel({round: true}),
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
  beforeA: ({before}, {consonant, vowel, suffix}, {affected}) => (
    // {env: {next: [{type: `consonant`, features: {articulator: `lips`}}, {type: `vowel`, features: {backness: `back`}}]}}
    before(
      consonant(features => features.articulator.lips),
      vowel(features => features.backness.back),
      suffix((features, traits) => traits.plural)
    )
  ),
});

const what3 = test({
  spec: {context: {affected: true}},
  env: {next: [{type: `consonant`, features: {emphatic: true}}]},
},
{
  base: {
    etc: test => [{type: `consonant`, features: {} as any}],
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

const final = finalize(bruv);

const yiss = final.what((is, when) => [
  is.woah.etc(3),
  when.beforeA(
    is.woah.etc(4)
  ),
]);


yiss[1][0].for;

final.what((is, when) => {const test = is.woah.etc(3); const wat = test.for.value; return [];});
