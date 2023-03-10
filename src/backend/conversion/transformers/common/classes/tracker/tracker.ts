/* eslint-disable max-classes-per-file */

import * as ABC from "../../../../alphabets/common";
import * as Layers from "../../../../layers/common";
import {List, ListNode} from "./list";
import {Direction, Rule, IntoSpec, TransformType} from "../capture-types";
import {Optional, ValuesOf} from "../../../../utils/typetools";
import {normalizeMatch} from "../../match";

export type InitialLayers = {
  layers: Record<string, Layers.AnyLayer>
  links: Record<string, Optional<string>>
};
type PreTrackerValue = Exclude<ValuesOf<IntoSpec<any, Layers.AnyLayer, ABC.AnyAlphabet, any>>, Function>;
type TrackerValue = ABC.Base | List<Tracker>;

class LayerHistory {
  private history: Array<{
    options: Record<string, PreTrackerValue>,
    current: string
  }> = [];

  private indices: Record<string, number> = {};

  constructor(private layer: string) {}

  feed(initial: ABC.Base) {
    // in the future could this cache this.history before clearing?
    // so that it can be restored later on if the initial entry is ever
    // reset to the same thing
    this.history.length = 0;
    this.history.push({
      options: {initial},
      current: `initial`,
    });
    this.indices = {initial: 0};
  }

  insert(feature: string, options: Record<string, PreTrackerValue>, current: string) {
    this.indices[feature] = this.history.length;
    this.history.push({
      options,
      current,
    });
  }

  get current(): Optional<PreTrackerValue> {
    const current = this.history[this.history.length - 1];
    return current.options[current.current];
  }
}

class TrackerLayer {
  private history = new LayerHistory(this.name);
  private environmentCache: Record<`${Direction}${string}`, Optional<TrackerValue>> = {};
  private dependents: Map<TrackerLayer, Array<`${Direction}${string}`>> = new Map();
  private environment: Record<`${Direction}${string}`, TrackerValue | null> = {};

  constructor(
    initial: ABC.Base,
    private name: string,
    private rules: [string, Rule[]][],
    private parent: Tracker,
  ) {
    // so this could do w/o the outer loop for speed but i think typescript doesn't
    // understand when you try to define a getter/setter with Object.defineProperties()
    Object.values(Direction).forEach(dir => {
      parent.layers.layers[name].types.reduce(
        (o, type) => Object.defineProperty(
          o,
          `${dir}${type}`,
          {get: () => this.fetchDependency(dir, type) ?? null},
        ),
        this.environment,
      );
    });
    this.feed(initial);
  }

  private get next(): Optional<TrackerLayer> {
    return this.parent.nextOnLayer(this.name);
  }

  private get prev(): Optional<TrackerLayer> {
    return this.parent.prevOnLayer(this.name);
  }

  get current(): Optional<TrackerValue> {
    const preVal = this.history.current;
    if (Array.isArray(preVal)) {
      const ret = [new Tracker(this.parent.layers, this.parent.rules).feed(this.name, preVal[0])];
      preVal.slice(1).forEach(v => ret.push(
        new Tracker(this.parent.layers, this.parent.rules, ret[ret.length - 1])
          .feed(this.name, v),
      ));
      // should this be trackerlist somehow (not sure what trackerlist is actually for now)
      return List.fromArray(ret);
    }
    return preVal;
  }

  fetchDependency(dir: Direction, type: Optional<string>): Optional<TrackerValue> {
    const typeKey = type ?? ``;
    if (this.environmentCache[`${dir}${typeKey}`] === undefined) {
      this.environmentCache[`${dir}${typeKey}`] = this.findDependency(dir, type)?.current;
    }
    return this.environmentCache[`${dir}${typeKey}`];
  }

  matches(obj: any): boolean {
    return normalizeMatch(obj).matches(this.current);
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

  applyRules() {
    this.rules.forEach(([feature, rules]) => {
      rules.forEach(rule => {
        if (!this.matches(rule.from)) {
          return;
        }
        if (!normalizeMatch(rule.where).matches(this.environment)) {
          return;
        }
        switch (rule.type) {
          case TransformType.promotion:
            this.promote(rule.into, feature);
            break;
          default:
            throw new Error(`(eating cereal) \`rule.type\` will never not be a member of TransformType`);
        }
      });
    });
  }

  promote(into: IntoSpec<any, Layers.AnyLayer, ABC.AnyAlphabet, any>, feature: string) {
    // XXX: is this an ok way to select the default option...?
    // TODO: parse array into trackerlist or something ugh
    this.history.insert(
      feature,
      Object.fromEntries(Object.entries(into).map(([k, v]) => {
        if (v instanceof Function) {
          return [k, v(this.current, this.parent.layers.layers[this.parent.nextLayer(this.name)!])];
        }
        return [k, v];
      })),
      Object.keys(into)[0],
    );
  }

  invalidateDependencies(environments: Array<`${Direction}${string}`>) {
    environments.forEach(key => {
      this.environmentCache[key] = undefined;
    });
    /*
    environments.prev.forEach(key => {
      this.environmentCache.next[key] = undefined;
    });
    environments.next.forEach(key => {
      this.environmentCache.prev[key] = undefined;
    });
    */
  }

  private invalidateDependents() {
    this.dependents.forEach((relationships, peer) => {
      peer.invalidateDependencies(relationships);
      peer.applyRules();
    });
  }

  feed(initial: ABC.Base) {
    this.history.feed(initial);
    this.invalidateDependents();
    this.applyRules();
  }
}

export class Tracker implements ListNode<Tracker> {
  public prev: Optional<Tracker> = undefined;
  public next: Optional<Tracker> = undefined;
  private layerValues: Record<string, Optional<TrackerLayer>>;
  private minLayer: Optional<string> = undefined;

  constructor(
    public layers: InitialLayers,
    public rules: Record<string, Record<string, Rule[]>>,
    prev: Optional<Tracker> = undefined,
  ) {
    if (prev !== undefined) {
      prev.append(this);
    }
    this.layerValues = Object.fromEntries(
      Object.keys(this.layers.layers).map(name => [name, undefined]),
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

  nextLayer(name: string): Optional<string> {
    return this.layers.links[name];
  }
}
