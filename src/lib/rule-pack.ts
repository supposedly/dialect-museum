import {Alphabet, ApplyMatchAsType, ApplyMatchSchemaOf, MembersWithContext, NormalizeToMatch, QualifiedPathsOf} from "./alphabet";
import {Specs} from "./environment";
import {Match, MatchAsType, MatchInstance, MatchSchemaOf, MatchesExtending, SafeMatchSchemaOf} from "./utils/match";
import {IsUnion, MergeUnion, Merge, ValuesOf, Update} from "./utils/typetools";
import {underlying} from "/languages/levantine/alphabets";

type AnyMembersWithContext = SafeMatchSchemaOf<{
  type: string,
  features: Record<string, Match>,
  context?: Record<string, Match>
}>;

type NestedArray<T> = T | ReadonlyArray<NestedArray<T>>;

function rulePack<
  const Source extends Alphabet,
  const Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet>,
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
    const Targets extends Record<string, ReadonlyArray<MembersWithContext<Source>>>,
    const Constraints extends Record<string, (
      environment: {
        before<
          const Arr extends ReadonlyArray<SafeMatchSchemaOf<NestedArray<MembersWithContext<Source>>>>
        >(...arr: Arr): {environment: {next: Arr}},
        after<
          const Arr extends ReadonlyArray<SafeMatchSchemaOf<NestedArray<MembersWithContext<Source>>>>
        >(...arr: Arr): {environment: {prev: Arr}},
      },
      types: {
        [T in keyof Source[`types`]]: {
          <
            const V extends (
              IsUnion<keyof Source[`types`][T]> extends true
                ? SafeMatchSchemaOf<Source[`types`][T]>
                : SafeMatchSchemaOf<ValuesOf<Source[`types`][T]>>
              ),
            const Context extends SafeMatchSchemaOf<Source[`context`]>
          >(v?: V, context?: Context): {
            type: T
            features: IsUnion<keyof Source[`types`][T]> extends true
              ? [SafeMatchSchemaOf<Source[`types`][T]>] extends [V] ? MatchAsType<Source[`types`][T]> : MatchAsType<V>
              : {[K in keyof Source[`types`][T]]: [SafeMatchSchemaOf<Source[`types`][T]>] extends [V] ? MatchAsType<Source[`types`][T]> : MatchAsType<V>}
            context: [SafeMatchSchemaOf<Source[`context`]>] extends [Context]
              ? MatchAsType<Source[`context`]>
              : MatchAsType<Context>
          }
          with<
            const V extends ((features: QualifiedPathsOf<Source[`types`][T]>) => SafeMatchSchemaOf<Source[`types`][T]>),
            const Context extends ((context: QualifiedPathsOf<Source[`context`]>) => SafeMatchSchemaOf<Source[`context`]>)
          >(v: V, context?: Context): {
            type: T
            features: [SafeMatchSchemaOf<Source[`types`][T]>] extends [ReturnType<V>] ? MatchAsType<Source[`types`][T]> : MatchAsType<ReturnType<V>>
            context: [SafeMatchSchemaOf<Source[`context`]>] extends [ReturnType<Context>]
            ? MatchAsType<Source[`context`]>
            : MatchAsType<ReturnType<Context>>
          }
        }
      },
      context: QualifiedPathsOf<Source[`context`]>
    ) => Specs<Source>>
  >(
    extraSpec: ExtraSpec,
    targets: Targets,
    constraints?: Constraints
  ): {
    [K in keyof Targets]: {
      name: K,
      for: MatchInstance<`all`, [Spec, ExtraSpec]>,
      into: Targets[K]
    }
  },
} {
  return null as any;
}

const test = rulePack(underlying, underlying, [], {});

const what = test({environment: {next: [{type: `consonant`, features: {emphatic: true}}]}},
  {
    woah: [{type: `consonant`, features: {} as any}],
  },
  {
    beforeA({before}, {consonant, vowel}, {affected}) {
      return before(consonant(), {match: `array`, value: {length: 3, fill: [consonant()]}});
    },
  }
);
