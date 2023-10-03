import {MatchSchemaOf} from "./utils/match";
import {MergeUnion, ValuesOf} from "./utils/typetools";
import {Alphabet, ApplyMatchAsType, MembersWithContext} from "./alphabet";

type _SpecsRecurse<
  ABC extends Alphabet,
  ABCHistory extends ReadonlyArray<Alphabet> | undefined = undefined,
  T extends keyof ABC[`types`] = string
> = MergeUnion<
  | {
    spec: T extends keyof ABC[`types`]
      ? ApplyMatchAsType<ABC[`types`][T]>
      : MembersWithContext<ABC> | keyof ABC[`types`]
    environment: MergeUnion<
      | {[Dir in `next` | `prev`]?: _SpecsRecurse<ABC, ABCHistory>}
      | ValuesOf<{
        [K in keyof ABC[`types`] & string]: {
          [Dir in `next` | `prev` as `${Dir}${Capitalize<K>}`]?: _SpecsRecurse<ABC, ABCHistory, K>
        }
      }>
    >
  }
  | (ABCHistory extends ReadonlyArray<infer U extends Alphabet> ?
    {was: {[A in U as A[`name`]]: _SpecsRecurse<A>}}
    : never
  )
>;


export type Specs<
  ABC extends Alphabet,
  ABCHistory extends ReadonlyArray<Alphabet> | undefined = undefined
> = MatchSchemaOf<_SpecsRecurse<ABC, ABCHistory>> extends infer Deferred ? Deferred : never;
