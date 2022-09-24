/* eslint-disable max-classes-per-file */

import * as ABC from "../../../../alphabets/common";
import * as Accents from "../../../../accents/common";
import {List, ListNode} from "./list";
import {Rule} from "../capture-types";

export type Layers = {
  layers: Record<string, Accents.AnyLayer>
  links: Record<string, Null<string>>
};
type Null<T> = T | null;
type TrackerValue = ABC.Base | List<Tracker>;
type Environments<T> = {
  next: T
  prev: T
};

export class TrackerLayer {
  private history: TrackerValue[][] = [];
  private environmentCache: Environments<Record<string, Null<TrackerValue>>> = {next: {}, prev: {}};
  private dependents: Map<TrackerLayer, Environments<string[]>> = new Map();

  constructor(
    initial: TrackerValue,
    private name: string,
    private rules: [string, Rule[]][],
    private parent: Tracker,
  ) {
    this.feed(initial);
  }

  private get next(): Null<TrackerLayer> {
    return this.parent.nextOnLayer(this.name);
  }

  private get prev(): Null<TrackerLayer> {
    return this.parent.prevOnLayer(this.name);
  }

  feed(initial: TrackerValue) {
    // in the future this could cache this.history before clearing
    // so that it can be restored later on if the initial is ever
    // reset to the same thing
    this.history.length = 0;
    this.history.push([initial]);
    this.invalidateDependents();
    this.reapplyRules();
  }

  invalidateDependencies(environments: Environments<string[]>) {
    environments.next.forEach(key => {
      this.environmentCache.next[key] = null;
    });
    environments.prev.forEach(key => {
      this.environmentCache.prev[key] = null;
    });
  }

  invalidateDependents() {
    this.dependents.forEach((relationships, peer) => {
      peer.invalidateDependencies(relationships);
      peer.reapplyRules();
    });
  }

  reapplyRules() {
    /* ... */
  }
}

export class Tracker implements ListNode<Tracker> {
  public prev: Null<Tracker> = null;
  public next: Null<Tracker> = null;
  private layerValues: Record<string, Null<TrackerLayer>>;
  private minLayer: Null<string> = null;

  constructor(
    private layers: Layers,
    private rules: Record<string, Record<string, Rule[]>>,
    prev: Null<Tracker> = null,
  ) {
    if (prev !== null) {
      prev.append(this);
    }
    this.layerValues = Object.fromEntries(
      Object.keys(layers.layers).map(name => [name, null]),
    );
  }

  feed(layer: string, unit: ABC.Base): this {
    this.minLayer = layer;
    this.layerValues[layer] = new TrackerLayer(
      unit,
      layer,
      Object.entries(this.rules[layer]),
      this,
    );
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

  nextOnLayer(layer: string): Null<TrackerLayer> {
    return this.next?.findLayerForwards(layer) ?? null;
  }

  private findLayerForwards(layer: string): Null<TrackerLayer> {
    return this.layerValues[layer] ?? this.next?.findLayerForwards(layer) ?? null;
  }

  prevOnLayer(layer: string): Null<TrackerLayer> {
    return this.prev?.findLayerBackwards(layer) ?? null;
  }

  private findLayerBackwards(layer: string): Null<TrackerLayer> {
    return this.layerValues[layer] ?? this.prev?.findLayerBackwards(layer) ?? null;
  }
}
