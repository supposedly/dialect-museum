/* eslint-disable max-classes-per-file */

import * as ABC from "../../../../alphabets/common";
import * as Accents from "../../../../accents/common";
import {List, ListNode} from "./list";

type Null<T> = T | null;

export type Layers = {
  layers: Record<string, Accents.AnyLayer>
  links: Record<string, Null<string>>
};

type LayerValue = ABC.Base | List<Tracker>;

class LayerHistoryEntry implements ListNode<LayerHistoryEntry> {
  next: Null<LayerHistoryEntry> = null;

  append(head: LayerHistoryEntry) {
    if (this.next !== null) {
      let tail = head;
      while (tail.next !== null) {
        tail = tail.next;
      }
      tail.next = this.next;
    }
    this.next = head;
  }
}

export class Layer {
  private history: List<LayerHistoryEntry> = new List();
  private environmentCache: Record<string, LayerValue> = {};

  constructor(
    private value: LayerValue,
    private name: string,
    private parent: Tracker,
  ) {}

  private get next(): Null<Layer> {
    return this.parent.nextLayer(this.name);
  }

  private get prev(): Null<Layer> {
    return this.parent.prevLayer(this.name);
  }
}

export class Tracker implements ListNode<Tracker> {
  public prev: Null<Tracker> = null;
  public next: Null<Tracker> = null;
  private layers: Record<string, Null<Layer>>;
  private ogLayers: Layers;
  private minLayer: Null<string> = null;

  constructor(layers: Layers, prev: Null<Tracker> = null) {
    if (prev !== null) {
      prev.append(this);
    }
    this.layers = Object.fromEntries(
      Object.keys(layers.layers).map(name => [name, null]),
    );
    this.ogLayers = layers;
  }

  feed(layer: string, unit: ABC.Base): this {
    this.minLayer = layer;
    this.layers[layer] = new Layer(unit, layer, this);
    return this;
  }

  append(head: Tracker) {
    if (this.next !== null) {
      let tail = head;
      while (tail.next !== null) {
        tail = tail.next;
      }
      tail.next = this.next;
      this.next.prev = tail;
    }
    this.next = head;
    head.prev = this;
  }

  nextLayer(layer: string): Null<Layer> {
    return this.next?.findLayerForwards(layer) ?? null;
  }

  private findLayerForwards(layer: string): Null<Layer> {
    return this.layers[layer] ?? this.next?.findLayerForwards(layer) ?? null;
  }

  prevLayer(layer: string): Null<Layer> {
    return this.prev?.findLayerBackwards(layer) ?? null;
  }

  private findLayerBackwards(layer: string): Null<Layer> {
    return this.layers[layer] ?? this.prev?.findLayerBackwards(layer) ?? null;
  }
}
