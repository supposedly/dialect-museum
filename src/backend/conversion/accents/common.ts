import * as Layers from "../layers/common";

type OrderingConstraints<L extends Layers.AnyLayer, E = never> = Exclude<Layers.AccentFeatures<L>, E>;

export type Accent<L extends Layers.AnyLayer> = {
  [F in Layers.AccentFeatures<L>]: {
    before: OrderingConstraints<L, F>
    after: OrderingConstraints<L, F>
    variants: Record<Layers.FeatureVariants<L, F>, {
      before: OrderingConstraints<L, F>
      after: OrderingConstraints<L, F>
      clear: OrderingConstraints<L, F>
    }>
  }
};
