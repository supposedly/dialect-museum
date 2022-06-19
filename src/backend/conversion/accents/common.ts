import * as ABC from "../alphabets/common";
import {Narrow as $} from "../utils/typetools";

export type Layer<A extends ABC.AnyAlphabet, R extends Record<string, Set<string>>> = A & {
  accents: R
};

export type AnyLayer = ABC.AnyAlphabet & {
  accents: Record<string, Set<String>>
};

type ToSets<R extends Record<string, string[]>> = {
  [K in keyof R]: Set<R[K][number]>
};

export type AccentFeatures<A extends AnyLayer> = keyof A[`accents`];
export type AccentFeature<A extends AnyLayer, F extends AccentFeatures<A>> =
  A[`accents`][F] extends Set<infer U extends string>
    ? U
    : never;

export function toLayer<
  A extends ABC.AnyAlphabet,
  R extends Record<string, string[]>,
>(abc: A, accents: $<R>): Layer<A, ToSets<R>> {
  return {
    ...abc,
    accents: Object.fromEntries(
      Object.entries(accents).map(
        ([k, v]) => [k, new Set(v)],
      ),
    ) as any,
  };
}
