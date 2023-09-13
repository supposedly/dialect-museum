import {MergeUnion, ValuesOf} from "../../utils/typetools";
import {QualifiedPathsOf, Modify, AlphabetInput, Promote, ApplyMatchAsType} from "../alphabet";

type OptionalParams<T> = T | {feed: (...args: never[]) => T};

export type Library<
  ABC extends AlphabetInput,
  T extends keyof ABC[`types`],
  NextABC extends `modify` | AlphabetInput,
> = Record<string, Record<string, OptionalParams<
  NextABC extends AlphabetInput ? Promote<T, ABC, NextABC> : Modify<T, ABC>
>>>;

type MembersWithContext<ABC extends AlphabetInput> = ValuesOf<{
  [K in keyof ABC[`types`]]:
    | MergeUnion<
      | {[k in K]: ApplyMatchAsType<ABC[`types`][K]>}
      | {context?: ApplyMatchAsType<ABC[`context`]>}
    >
    | {type: K, features: ApplyMatchAsType<ABC[`types`][K]>, context?: ApplyMatchAsType<ABC[`context`]>}
}>;

type ConvertShorthand<
  ABC extends AlphabetInput,
> = <
  const Args extends ReadonlyArray<MembersWithContext<ABC>>
>(...args: Args) => {
  [Idx in keyof Args]: keyof Args[Idx] extends infer Distribute
    ? Distribute extends keyof ABC[`types`]
      ? MergeUnion<
        | {type: Distribute, features: Args[Idx][Distribute & keyof Args[Idx]]}
        | Omit<Args[Idx], Distribute>
      >
      : Args[Idx] extends {type: keyof ABC[`types`], features?: unknown, context?: unknown}
        ? Args[Idx]
        : never
    : never
};

export function modify<
  const ABC extends AlphabetInput,
  const T extends keyof ABC[`types`] & string,
  const R extends Library<ABC, T, `modify`>
>(
  abc: ABC,
  type: T,
  createLibrary: (
    array: ConvertShorthand<ABC>,
    features: QualifiedPathsOf<ABC[`types`][T], [`features`]>,
  ) => R,
): R {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createLibrary((): any => {}, abc.types[type] as any);
}

export function promote<
  const ABC extends AlphabetInput,
  const T extends keyof ABC[`types`] & string,
  const NextABC extends AlphabetInput,
  const R extends Library<ABC, T, NextABC>
>(
  abc: ABC,
  type: T,
  nextABC: NextABC,
  createLibrary: (
    array: ConvertShorthand<NextABC>,
  ) => R,
): R {
  return createLibrary((): any => {});  // eslint-disable-line @typescript-eslint/no-explicit-any
}
