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
type TrackerValue = ABC.Base | List<Tracker>;

class TransformHistory {
  private history: Array<{
    options: Record<string, TrackerValue>,
    current: string,
    feature: string
  }> = [];

  private indices: Record<string, number> = {};

  constructor(private layer: string) {}

  feed(options: Record<string, TrackerValue>, feature: string = `initial`) {
    // in the future could this cache this.history before clearing?
    // so that it can be restored later on if the initial entry is ever
    // reset to the same thing
    this.history.length = 0;
    this.insert(options, feature);
  }

  insert(options: Record<string, TrackerValue>, feature: string) {
    this.indices[feature] = this.history.length;
    this.history.push({
      options,
      current: Object.keys(options)[0],
      feature,
    });
  }

  select(option: string) {
    if (!Object.hasOwnProperty.call(this.currentEntry.options, option)) {
      throw new Error(
        `No option '${option}' for feature ${this.currentEntry.feature}${
        ``
        }, only ${JSON.stringify(this.currentEntry.options)}`,
      );
    }
    this.currentEntry.current = option;
  }

  private get currentEntry(): typeof this.history[number] {
    return this.history[this.history.length - 1];
  }

  get current(): Optional<TrackerValue> {
    return this.currentEntry.options[this.currentEntry.current];
  }
}

class TrackerLayer {
  private history = new TransformHistory(this.name);
  private environmentCache: Record<`${Direction}${string}`, Optional<TrackerValue>> = {};
  private dependents: Map<TrackerLayer, Array<`${Direction}${string}`>> = new Map();
  private environment: Record<`${Direction}${string}`, TrackerValue | null> = {};

  constructor(
    public name: string,
    private rules: [string, Rule[]][],
    private parent: Tracker,
  ) {
    // this could do w/o the outer loop for speed but i think typescript doesn't
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
  }

  private get next(): Optional<TrackerLayer> {
    return this.parent.nextOnLayer(this.name);
  }

  private get prev(): Optional<TrackerLayer> {
    return this.parent.prevOnLayer(this.name);
  }

  get current(): Optional<TrackerValue> {
    return this.history.current;
  }

  // name means to apply func [of] IntoSpec not to 'apply into [a] spec func'
  applyIntoSpec<I extends IntoSpec>(
    intoSpec: I,
    match: any,
    abc: ABC.AnyAlphabet,
  ): Record<keyof I, TrackerValue> {
    return Object.fromEntries(
      Object.entries(intoSpec).map(([k, v]) => {
        const val = v instanceof Function ? v(match, abc) : v;
        if (Array.isArray(val)) {
          const ret: Tracker[] = [];
          val.forEach(e => ret.push(
            new Tracker(this.parent.layers, this.parent.rules, ret[ret.length - 1])  // last arg intentionally undefined on first run
              .feed(this.name, e),
          ));
          // should this be trackerlist somehow (not sure what trackerlist is actually for now)
          return [k, List.fromArray(ret)];
        }
        return [k, val];
      }),
    );
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
            this.parent.promote(this, rule.into, feature);
            break;
          case TransformType.transformation:
            this.transform(rule.into, feature);
            break;
          default:
            throw new Error(`(eating cereal) \`rule.type\` will never not be a member of TransformType`);
        }
      });
    });
  }

  transform(into: IntoSpec, feature: string) {
    this.history.insert(
      // XXX: the this.parent access is sus, should the AnyLayer be stored on this or smth
      // or maybe transform() should be on parent like promote() is... but no nah
      this.applyIntoSpec(into, this.current, this.parent.layers.layers[this.name]),
      feature,
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

  feed<R extends Record<string, TrackerValue>>(
    initial: R,
    feature?: string,
  ): this {
    this.history.feed(
      initial,
      feature,
    );
    this.invalidateDependents();
    this.applyRules();
    return this;
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
      layer,
      Object.entries(this.rules[layer]),
      this,
    ).feed({initial: unit}, `initial`);
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

  promote(layer: TrackerLayer, into: IntoSpec, feature: string) {
    const nextLayer = this.layers.links[layer.name];
    if (!nextLayer) {
      return;
    }
    if (!this.layerValues[nextLayer]) {
      this.layerValues[nextLayer] = new TrackerLayer(
        nextLayer,
        Object.entries(this.rules[nextLayer]),
        this,
      );
    }
    const nextLayerValue = this.layerValues[nextLayer]!;
    nextLayerValue.feed(
      // TODO: this should maybe happen back at the call site in TrackerLayer
      nextLayerValue.applyIntoSpec(into, layer.current, this.layers.layers[nextLayer]),
      feature,
    );
  }
}
