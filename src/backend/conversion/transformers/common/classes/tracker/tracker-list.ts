import * as Layers from "../../../../layers/common";
import * as ABC from "../../../../alphabets/common";
import {type Rule} from "../capture-types";
import {List} from "./list";
import {type InitialLayers, Tracker} from "./tracker";

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

  /*
  // XXX: what the even
  static fromArray2(
    arr: Tracker[],
    rules: TrackerList[`rules`],
    layers: ReadonlyArray<[string, Layers.AnyLayer]>
  ): TrackerList {
    return arr.reduce(
      (list, tracker) => {
        Object.defineProperties(tracker, {
          next: {value: undefined},
          append: {value: function append(head: Tracker) {
            if (this.next !== undefined) {
              let tail = head;
              while (tail.next !== undefined) {
                tail = tail.next;
              }
              tail.next = this.next;
            }
            this.next = head;
          },
        }});
        list.append(tracker);
        return list;
      },
      new TrackerList(rules, layers),
    );
  }
  */

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
