import * as Layers from "../../../../layers/common";
import * as ABC from "../../../../alphabets/common";
import {Rule} from "../capture-types";
import {List} from "./list";
import {InitialLayers, Tracker} from "./tracker";

export default class TrackerList extends List<Tracker> {
  private layers: InitialLayers;

  constructor(
    private readonly rules: Record<string, Record<string, Rule[]>>,
    layers: ReadonlyArray<[string, Layers.AnyLayer]>,
  ) {
    super();
    this.layers = {
      layers: Object.fromEntries(layers),
      links: Object.fromEntries(layers.map(
        ([name, _], idx) => [name, layers[idx + 1]?.[0]],
      )),
    };
  }

  feed(layer: string, text: ABC.Base[]): this {
    const [first, ...rest] = text;
    this.head = new Tracker(this.layers, this.rules).feed(layer, first);
    this.tail = rest.reduce(
      (tail, unit) => new Tracker(this.layers, this.rules, tail).feed(layer, unit),
      this.head,
    );
    return this;
  }
}
