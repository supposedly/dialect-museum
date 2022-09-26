import * as ABC from "../alphabets/common";
import {Narrow as $, UniqueArray} from "../utils/typetools";

type Accents = Record<string, string[]>;

export type Layer<A extends ABC.AnyAlphabet, R extends Accents> = {
  accents: R
} & A;

export type AnyLayer = Layer<ABC.AnyAlphabet, Accents>;

type UniqueArrays<R extends Accents> = {
  [K in keyof R]: UniqueArray<R[K]>
};

export type AccentFeatures<A extends AnyLayer> = keyof A[`accents`];
export type FeatureVariants<A extends AnyLayer, F extends AccentFeatures<A>> = A[`accents`][F][number];

export function toLayer<
  A extends ABC.AnyAlphabet,
  R extends Accents,
>(abc: A, accents: $<R>): Layer<A, UniqueArrays<R>> {
  return {
    ...abc,
    accents: Object.fromEntries(
      Object.entries(accents).map(
        ([k, v]) => [k, new Set(v)],
      ),
    ) as any,
  };
}
