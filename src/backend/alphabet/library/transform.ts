import {MergeUnion, ValuesOf} from "../../utils/typetools";
import {QualifiedPathsOf, Modify, AlphabetInput, Promote, ApplyMatchAsType, qualifiedPathsOf} from "../alphabet";

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

function fixShorthand(args: ReadonlyArray<Record<string, unknown>>) {
  return args.map(o => {
    if (`type` in o) {
      return o;
    }
    const type = Object.keys(o).find(k => k !== `context`)!;
    return {
      type,
      features: (o as Record<string, unknown>)[type],
      context: o.context,
    };
  });
}

export function modify<
  const ABC extends AlphabetInput,
  const T extends keyof ABC[`types`] & string,
  const R extends Library<ABC, T, `modify`>
>(
  abc: ABC,
  type: T,
  createLibrary: (
    fix: ConvertShorthand<ABC>,
    features: QualifiedPathsOf<ABC[`types`][T], [`features`]>,
  ) => R,
): R {
  return createLibrary(
    fixShorthand as ConvertShorthand<ABC>,
    qualifiedPathsOf(abc.types[type] as ABC[`types`][T], [`features`])
  );
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
    fix: ConvertShorthand<NextABC>,
  ) => R,
): R {
  return createLibrary(fixShorthand as ConvertShorthand<NextABC>);
}
