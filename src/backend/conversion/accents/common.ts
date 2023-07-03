import * as Layers from "../layers/common";
import {type Narrow as $, type UniqueArray} from "../utils/typetools";

type OrderingConstraints<L extends Layers.AnyLayer, E = never> =
  | Exclude<Layers.AccentFeatures<L>, E>
  | Array<Exclude<Layers.AccentFeatures<L>, E>>
  | Record<Exclude<Layers.AccentFeatures<L>, E>, number>;

export type Accent<Ls extends Layers.AnyLayer[]> = {
  [L in Ls[number] as L[`name`]]: {
    [F in Layers.AccentFeatures<L>]: {
      variants: Record<
        Layers.FeatureVariants<L, F>,
        number | [number, {
          before?: OrderingConstraints<L, F>
          after?: OrderingConstraints<L, F>
          clear?: OrderingConstraints<L, F>
        }]
      >
      before?: OrderingConstraints<L, F>
      after?: OrderingConstraints<L, F>
    }
  }
};

export type AnyAccent = Accent<Layers.AnyLayer[]>;

type UniqueArrays<T> = T extends unknown[] ? UniqueArray<T> : {
  [K in keyof T]: UniqueArrays<T[K]>
};

export function toAccent<L extends Layers.AnyLayer[], A extends Accent<UniqueArray<L>>>(
  _layer: $<L>,
  accent: $<A>,
): UniqueArrays<A> {
  return accent as any;
}
