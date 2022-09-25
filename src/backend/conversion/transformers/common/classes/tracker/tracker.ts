/* eslint-disable max-classes-per-file */

import * as ABC from "../../../../alphabets/common";
import * as Accents from "../../../../accents/common";
import {List, ListNode} from "./list";
import {Direction, Rule} from "../capture-types";
import {Optional} from "../../../../utils/typetools";
import match, {Match} from "../../match";

export type Layers = {
  layers: Record<string, Accents.AnyLayer>
  links: Record<string, Optional<string>>
};
type TrackerValue = ABC.Base | List<Tracker>;
type Environments<T> = {
  next: T
  prev: T
};

class TrackerLayer {
  private history: TrackerValue[][] = [];
  private environmentCache: Environments<Record<string, Optional<TrackerValue>>> = {next: {}, prev: {}};
  private dependents: Map<TrackerLayer, Environments<string[]>> = new Map();

  constructor(
    initial: TrackerValue,
    private name: string,
    private rules: [string, Rule[]][],
    private parent: Tracker,
  ) {
    this.feed(initial);
  }

  private get next(): Optional<TrackerLayer> {
    return this.parent.nextOnLayer(this.name);
  }

  private get prev(): Optional<TrackerLayer> {
    return this.parent.prevOnLayer(this.name);
  }

  get current(): TrackerValue {
    /* ... */
  }

  matches(obj: any): boolean {
    obj = obj instanceof Match ? obj : match(obj);
    return obj.matches(this.current);
  }

  findDependency(dir: Direction, type: Optional<string>, includeSelf = false): Optional<TrackerLayer> {
    if (!includeSelf) {
      return this[dir]?.findDependency(dir, type, true);
    }
    if (this.current) {
      if (type === undefined) {
        return this;
      }
    }
    return this.matches({type}) ? this : this[dir]?.findDependency(dir, type, true);
  }

  reapplyRules() {
    /* ... */
  }

  invalidateDependencies(environments: Environments<string[]>) {
    environments.prev.forEach(key => {
      this.environmentCache.next[key] = undefined;
    });
    environments.next.forEach(key => {
      this.environmentCache.prev[key] = undefined;
    });
  }

  private invalidateDependents() {
    this.dependents.forEach((relationships, peer) => {
      peer.invalidateDependencies(relationships);
      peer.reapplyRules();
    });
  }

  feed(initial: TrackerValue) {
    // in the future this could cache this.history before clearing
    // so that it can be restored later on if the initial entry is ever
    // reset to the same thing
    this.history.length = 0;
    this.history.push([initial]);
    this.invalidateDependents();
    this.reapplyRules();
  }
}

export class Tracker implements ListNode<Tracker> {
  public prev: Optional<Tracker> = undefined;
  public next: Optional<Tracker> = undefined;
  private layerValues: Record<string, Optional<TrackerLayer>>;
  private minLayer: Optional<string> = undefined;

  constructor(
    private layers: Layers,
    private rules: Record<string, Record<string, Rule[]>>,
    prev: Optional<Tracker> = undefined,
  ) {
    if (prev !== undefined) {
      prev.append(this);
    }
    this.layerValues = Object.fromEntries(
      Object.keys(layers.layers).map(name => [name, undefined]),
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
    if (this.next !== undefined) {
      let tail = head;
      while (tail.next !== undefined) {
        tail = tail.next;
      }
      tail.next = this.next;
      this.next.prev = tail;
    }
    this.next = head;
    head.prev = this;
  }

  nextOnLayer(layer: string, includeSelf = false): Optional<TrackerLayer> {
    if (!includeSelf) {
      return this.next?.nextOnLayer(layer, true);
    }
    return this.layerValues[layer] ?? this.next?.nextOnLayer(layer, true);
  }

  prevOnLayer(layer: string, includeSelf = false): Optional<TrackerLayer> {
    if (!includeSelf) {
      return this.prev?.prevOnLayer(layer, true);
    }
    return this.layerValues[layer] ?? this.prev?.prevOnLayer(layer, true);
  }
}
