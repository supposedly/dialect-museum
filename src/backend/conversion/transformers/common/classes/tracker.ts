/* eslint-disable max-classes-per-file */

import * as ABC from "../../../alphabets/common";
import {Rule} from "./capture-types";

type Layers = {
  layers: Record<string, ABC.AnyAlphabet>
  links: Record<string, string>
};

export class Tracker {
  public prev: Tracker | null = null;
  public next: Tracker | null = null;

  constructor(
    private unit: ABC.Base,
    private minLayer: string,
    private layers: Layers,
  ) {}
}

export class TrackerList {
  private head: Tracker | null = null;
  private last: Tracker | null = null;
  private layers: Layers;

  constructor(
    private readonly rules: Record<string, Record<string, Rule[]>>,
    layers: ReadonlyArray<[string, ABC.AnyAlphabet]>,
  ) {
    this.layers = {
      layers: Object.fromEntries(layers),
      links: Object.fromEntries(layers.map(
        ([name, _], idx) => [name, layers[idx + 1]?.[0]],
      )),
    };
  }

  feed(layer: string, text: ABC.Base[]): this {
    const [first, ...rest] = text;
    const head = new Tracker(first, layer, this.layers);
    let last = head;
    rest.forEach(unit => {
      last.next = new Tracker(unit, layer, this.layers);
      last = last.next;
    });
    this.head = head;
    this.last = last;

    return this;
  }
}
