import {Alphabet, MembersWithContext} from "./alphabet";
import {EnvironmentFunc, Specs} from "./environment";
import {MatchInstance} from "./utils/match";
import {underlying} from "/languages/levantine/alphabets";

type NestedRecord<T> = {[key: string]: T | NestedRecord<T>};

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
    Pack
  >>(r: R): R
  <
    const ExtraSpec extends Specs<Source>,
    const Targets extends NestedRecord<ReadonlyArray<MembersWithContext<Target>>>,
    const Constraints extends Record<string, EnvironmentFunc<Source>>
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

const test = rulePack(underlying, underlying, [], {});

const what = test({
  spec: segment => segment.consonant(),
  env: ({before}, {consonant}) => before(consonant(features => features.emphatic())),
},
{
  woah: [{type: `consonant`, features: {} as any}],
},
{
  beforeA: ({before}, {consonant, vowel}, {affected}) => (
    before(
      consonant(),
      consonant(features => ({match: `custom`, value: test => test.articulator === `lips`})),
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
      consonant({articulator: `lips`}),
      vowel(features => features.backness.back)
    )
  ),
});
