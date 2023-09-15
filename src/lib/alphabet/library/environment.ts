import {MatchSchemaOf} from "../../utils/match";
import {MergeUnion, ValuesOf} from "../../utils/typetools";
import {AlphabetInput, Alphabet, ApplyMatchAsType, MembersWithContext} from "../alphabet";

type _EnvironmentSpecsRecurse<
  ABC extends AlphabetInput,
  ABCHistory extends ReadonlyArray<Alphabet> | undefined = undefined
> = MergeUnion<
  | {[Dir in `next` | `prev`]?: {
    spec: MembersWithContext<ABC>,
    env: _EnvironmentSpecsRecurse<ABC, ABCHistory> extends infer Deferred ? Deferred : never
  }}
  | ValuesOf<{
    [K in keyof ABC[`types`] & string]: {
      [Dir in `next` | `prev` as `${Dir}${Capitalize<K>}`]?: {
        spec: ApplyMatchAsType<ABC[`types`][K]>
        env: _EnvironmentSpecsRecurse<ABC, ABCHistory> extends infer Deferred ? Deferred : never
      }
    }
  }>
  | (
    ABCHistory extends ReadonlyArray<infer U extends Alphabet>
      ? {was: {[A in U as A[`name`]]: MembersWithContext<A>}}
      : never
  )
>;
type EnvironmentSpecs<
  ABC extends AlphabetInput,
  ABCHistory extends ReadonlyArray<Alphabet> | undefined = undefined
> = MatchSchemaOf<_EnvironmentSpecsRecurse<ABC, ABCHistory>> extends infer Deferred ? Deferred : never;

export type EnvironmentLibrary<ABC extends AlphabetInput> = Record<string, EnvironmentSpecs<ABC>>;
