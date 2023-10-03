import {MatchSchemaOf} from "./utils/match";
import {MergeUnion, ValuesOf} from "./utils/typetools";
import {Alphabet, ApplyMatchAsType, MembersWithContext} from "./alphabet";

export type NestedArray<T> = ReadonlyArray<T | NestedArray<T>>;

export type Specs<
  ABC extends Alphabet,
  ABCHistory extends ReadonlyArray<Alphabet> | undefined = undefined,
  T extends keyof ABC[`types`] = string
> = MatchSchemaOf<MergeUnion<
  | {
    spec: T extends keyof ABC[`types`]
      ? ApplyMatchAsType<ABC[`types`][T]>
      : MembersWithContext<ABC> | keyof ABC[`types`]
    environment: {[Dir in `next` | `prev`]?: NestedArray<MembersWithContext<ABC>>} 
    /* environment: MergeUnion<
      | {[Dir in `next` | `prev`]?: NestedArray<MembersWithContext<ABC>>}
      | ValuesOf<{
        [K in keyof ABC[`types`] & string]: {
          [Dir in `next` | `prev` as `${Dir}${Capitalize<K>}`]?: ApplyMatchAsType<ABC[`types`][T]>
        }
      }>
    > */
  }
  | (ABCHistory extends ReadonlyArray<infer U extends Alphabet> ?
    {was: {[A in U as A[`name`]]: Specs<A>}}
    : never
  )
>>;
