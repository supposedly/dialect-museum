import * as ABC from "../alphabets/common";
import {type Narrow as $, type UniqueArray} from "../utils/typetools";

type Features = Record<string, string[]>;

export type Layer<A extends ABC.AnyAlphabet, R extends Features> = {
  features: R
} & A;

export type AnyLayer = Layer<ABC.AnyAlphabet, Features>;

type UniqueArrays<R extends Features> = {
  [K in keyof R]: UniqueArray<R[K]>
};

export type AccentFeatures<A extends AnyLayer> = keyof A[`features`];
export type FeatureVariants<A extends AnyLayer, F extends AccentFeatures<A>> = A[`features`][F][number];

export function toLayer<
  A extends ABC.AnyAlphabet,
  R extends Features,
>(abc: A, features: $<R>): Layer<A, UniqueArrays<R>> {
  return {
    ...abc,
    features: Object.fromEntries(
      Object.entries(features).map(
        ([k, v]) => [k, new Set(v)],
      ),
    ) as any,
  };
}
