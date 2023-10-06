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
import {MatchInstance, MatchSchema, MatchSchemaOf} from "./utils/match";
import {Merge} from "./utils/typetools";
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

type Packed<R extends Record<
  string,
  unknown
>, Spec> = {
  children: R
  specs: Merge<Unfunc<Spec, `spec`>, Unfunc<Spec, `env`>>
};

type IntoToFunc<
  Into extends NestedRecordOr<ReadonlyArray<unknown>>,
  Spec
> = Into extends ReadonlyArray<unknown>
  ? (odds: number) => ({for: Merge<Unfunc<Spec, `spec`>, Unfunc<Spec, `env`>>, into: Into})
  : Into extends NestedRecord<ReadonlyArray<unknown>> ? {[K in keyof Into]: IntoToFunc<Into[K], Spec>}
  : never;
type RulesetToFunc<Rules extends Record<string, Ruleset>> = {
  [K in keyof Rules]: IntoToFunc<
    Rules[K][`into`],
    Merge<Unfunc<Rules[K][`for`], `spec`>, Unfunc<Rules[K][`for`], `env`>>
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
    : RulePack[K] extends Packed<Record<string, unknown>, unknown> ? ProcessPack<RulePack[K]>
    : never
};

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
        // name: K,
        for: ExtraSpec,
        into: Targets[K]
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

const final = finalize(bruv);

final.what((is, when) => [
  is.woah.etc(3),
  when.beforeA(
    is.woah.etc(4)
  ),
]);

final.what((is, when) => {const test = is.woah.etc(3); const wat = test.for.value; return [];});
