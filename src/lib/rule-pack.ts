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

type ComposeEnvironment<
  Arr extends ReadonlyArray<unknown>,
  Dir extends `next` | `prev`
> = Arr extends readonly [
  infer Head extends AnyMembersWithContext,
  ...infer Tail extends ReadonlyArray<AnyMembersWithContext>
]
  ? {[D in Dir]: {spec: Head, environment: ComposeEnvironment<Tail, Dir>}}
  : Record<string, never>;

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
          const Arr extends ReadonlyArray<SafeMatchSchemaOf<MembersWithContext<Source>>>
        >(...arr: Arr): {environment: ComposeEnvironment<Arr, `next`>},
        after<
          const Arr extends ReadonlyArray<SafeMatchSchemaOf<MembersWithContext<Source>>>
        >(...arr: Arr): {environment: ComposeEnvironment<Arr, `prev`>},
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

const what = test({environment: {nextConsonant: {spec: {emphatic: true}}}},
  {
    woah: [{} as any],
  },
  {
    beforeA({before}, {consonant, vowel}, {affected}) {
      const a = {
        environment: {
          next: null},
      };
      const b = before({type: `vowel`, features: {backness: `back`}, context: {affected: true}});
      return a;
    },
  }
);


type Man = ((features: QualifiedPathsOf<NormalizeToMatch<{readonly height: readonly [`high`, `mid`, `low`]; readonly backness: readonly [`front`, `mid`, `back`]; readonly round: {readonly match: `type`; readonly value: `boolean`;}; readonly long: {readonly match: `type`; readonly value: `boolean`;};}>>) => MatchSchemaOf<NormalizeToMatch<{readonly height: readonly [`high`, `mid`, `low`]; readonly backness: readonly [`front`, `mid`, `back`]; readonly round: {readonly match: `type`; readonly value: `boolean`;}; readonly long: {readonly match: `type`; readonly value: `boolean`;};}>>);

const tdest: Man = features => ({});

type Wat = MatchAsType<ReturnType<() => {
  match: `all`,
  value: [
    {backness: `back`},
    {round: `true`}
  ]
}>>;

type A = {environment: {next: {spec: {type: string; features: {backness: string;}; context: {affected: boolean;};}; environment: Record<string, never>;};};};
type B = ApplyMatchSchemaOf<{
  spec?: `consonant` | `vowel` | `suffix` | `delimiter` | `pronoun` | MembersWithContext<{
    name: `underlying`; types: NormalizeTypes<{readonly consonant: {readonly voiced: {readonly match: `type`; readonly value: `boolean`;}; readonly emphatic: {readonly match: `type`; readonly value: `boolean`;}; readonly articulator: readonly [`throat`, `tongue`, `lips`]; readonly location: readonly [`glottis`, `pharynx`, `uvula`, `velum`, `palate`, `bridge`, `ridge`, `teeth`, `lips`]; readonly manner: readonly [`approximant`, `flap`, `fricative`, `affricate`, `nasal`, `plosive`];}; readonly vowel: {readonly height: readonly [`high`, `mid`, `low`]; readonly backness: readonly [`front`, `mid`, `back`]; readonly round: {readonly match: `type`; readonly value: `boolean`;}; readonly long: {readonly match: `type`; readonly value: `boolean`;};}; readonly suffix: {readonly value: readonly [`f`, `fplural`, `dual`, `plural`, `aynplural`, `an`, `iyy`, `jiyy`, `negative`];}; readonly delimiter: {readonly value: readonly [`genitive`, `object`, `pseudosubject`, `dative`];}; readonly pronoun: {readonly person: readonly [`first`, `second`, `third`]; readonly gender: readonly [`masculine`, `feminine`, `common`]; readonly number: readonly [`singular`, `dual`, `plural`];};}>; context: NormalizeToMatch<{readonly affected: {readonly match: `type`; readonly value: `boolean`;};}>; traits: never;
  }>;
  environment?: {next?: any; prev?: any; nextConsonant?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly voiced: {readonly match: `type`; readonly value: `boolean`;}; readonly emphatic: {readonly match: `type`; readonly value: `boolean`;}; readonly articulator: readonly [`throat`, `tongue`, `lips`]; readonly location: readonly [`glottis`, `pharynx`, `uvula`, `velum`, `palate`, `bridge`, `ridge`, `teeth`, `lips`]; readonly manner: readonly [`approximant`, `flap`, `fricative`, `affricate`, `nasal`, `plosive`];}>>; environment: any;}; prevConsonant?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly voiced: {readonly match: `type`; readonly value: `boolean`;}; readonly emphatic: {readonly match: `type`; readonly value: `boolean`;}; readonly articulator: readonly [`throat`, `tongue`, `lips`]; readonly location: readonly [`glottis`, `pharynx`, `uvula`, `velum`, `palate`, `bridge`, `ridge`, `teeth`, `lips`]; readonly manner: readonly [`approximant`, `flap`, `fricative`, `affricate`, `nasal`, `plosive`];}>>; environment: any;}; nextVowel?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly height: readonly [`high`, `mid`, `low`]; readonly backness: readonly [`front`, `mid`, `back`]; readonly round: {readonly match: `type`; readonly value: `boolean`;}; readonly long: {readonly match: `type`; readonly value: `boolean`;};}>>; environment: any;}; prevVowel?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly height: readonly [`high`, `mid`, `low`]; readonly backness: readonly [`front`, `mid`, `back`]; readonly round: {readonly match: `type`; readonly value: `boolean`;}; readonly long: {readonly match: `type`; readonly value: `boolean`;};}>>; environment: any;}; nextSuffix?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly value: readonly [`f`, `fplural`, `dual`, `plural`, `aynplural`, `an`, `iyy`, `jiyy`, `negative`];}>>; environment: any;}; prevSuffix?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly value: readonly [`f`, `fplural`, `dual`, `plural`, `aynplural`, `an`, `iyy`, `jiyy`, `negative`];}>>; environment: any;}; nextDelimiter?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly value: readonly [`genitive`, `object`, `pseudosubject`, `dative`];}>>; environment: any;}; prevDelimiter?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly value: readonly [`genitive`, `object`, `pseudosubject`, `dative`];}>>; environment: any;}; nextPronoun?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly person: readonly [`first`, `second`, `third`]; readonly gender: readonly [`masculine`, `feminine`, `common`]; readonly number: readonly [`singular`, `dual`, `plural`];}>>; environment: any;}; prevPronoun?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly person: readonly [`first`, `second`, `third`]; readonly gender: readonly [`masculine`, `feminine`, `common`]; readonly number: readonly [`singular`, `dual`, `plural`];}>>; environment: any;};};}>;

type C = {next?: any; prev?: any; nextConsonant?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly voiced: {readonly match: `type`; readonly value: `boolean`;}; readonly emphatic: {readonly match: `type`; readonly value: `boolean`;}; readonly articulator: readonly [`throat`, `tongue`, `lips`]; readonly location: readonly [`glottis`, `pharynx`, `uvula`, `velum`, `palate`, `bridge`, `ridge`, `teeth`, `lips`]; readonly manner: readonly [`approximant`, `flap`, `fricative`, `affricate`, `nasal`, `plosive`];}>>; environment: any;}; prevConsonant?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly voiced: {readonly match: `type`; readonly value: `boolean`;}; readonly emphatic: {readonly match: `type`; readonly value: `boolean`;}; readonly articulator: readonly [`throat`, `tongue`, `lips`]; readonly location: readonly [`glottis`, `pharynx`, `uvula`, `velum`, `palate`, `bridge`, `ridge`, `teeth`, `lips`]; readonly manner: readonly [`approximant`, `flap`, `fricative`, `affricate`, `nasal`, `plosive`];}>>; environment: any;}; nextVowel?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly height: readonly [`high`, `mid`, `low`]; readonly backness: readonly [`front`, `mid`, `back`]; readonly round: {readonly match: `type`; readonly value: `boolean`;}; readonly long: {readonly match: `type`; readonly value: `boolean`;};}>>; environment: any;}; prevVowel?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly height: readonly [`high`, `mid`, `low`]; readonly backness: readonly [`front`, `mid`, `back`]; readonly round: {readonly match: `type`; readonly value: `boolean`;}; readonly long: {readonly match: `type`; readonly value: `boolean`;};}>>; environment: any;}; nextSuffix?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly value: readonly [`f`, `fplural`, `dual`, `plural`, `aynplural`, `an`, `iyy`, `jiyy`, `negative`];}>>; environment: any;}; prevSuffix?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly value: readonly [`f`, `fplural`, `dual`, `plural`, `aynplural`, `an`, `iyy`, `jiyy`, `negative`];}>>; environment: any;}; nextDelimiter?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly value: readonly [`genitive`, `object`, `pseudosubject`, `dative`];}>>; environment: any;}; prevDelimiter?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly value: readonly [`genitive`, `object`, `pseudosubject`, `dative`];}>>; environment: any;}; nextPronoun?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly person: readonly [`first`, `second`, `third`]; readonly gender: readonly [`masculine`, `feminine`, `common`]; readonly number: readonly [`singular`, `dual`, `plural`];}>>; environment: any;}; prevPronoun?: {spec: ApplyMatchAsType<NormalizeToMatch<{readonly person: readonly [`first`, `second`, `third`]; readonly gender: readonly [`masculine`, `feminine`, `common`]; readonly number: readonly [`singular`, `dual`, `plural`];}>>; environment: any;};};
const tesdsdfsddt: B[`environment`] = null as unknown as A[`environment`];
