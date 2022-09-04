import * as Accents from "../../../../accents/common";
import * as ABC from "../../../../alphabets/common";
import {Rule} from "../capture-types";
import {List} from "./list";
import {Layers, Tracker} from "./tracker";

export default class TrackerList extends List<Tracker> {
  private layers: Layers;

  constructor(
    private readonly rules: Record<string, Record<string, Rule[]>>,
    layers: ReadonlyArray<[string, Accents.AnyLayer]>,
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
    this.head = new Tracker(this.layers).feed(layer, first);
    this.tail = rest.reduce(
      (tail, unit) => new Tracker(this.layers, tail).feed(layer, unit),
      this.head,
    );
    return this;
  }
}
