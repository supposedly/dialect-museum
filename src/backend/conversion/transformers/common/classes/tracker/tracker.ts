/* eslint-disable max-classes-per-file */

import * as ABC from "../../../../alphabets/common";
import * as Layers from "../../../../layers/common";
import {List, type ListNode} from "./list";
import {Direction, type Rule, type IntoSpec, TransformType} from "../capture-types";
import {type Optional} from "../../../../utils/typetools";
import match from "../../match";
import {mergeObjects} from "../../helpers";

export type InitialLayers = {
  layers: Record<string, Layers.AnyLayer>
  links: Record<string, Optional<string>>
};
// i think trackervalue can't require ABC.Base anymore now that IntoSpec can Omit them
type TrackerValue = {}; // ABC.Base | List<Tracker>;
const ANCHOR = {};

class TransformHistory {
  private history: Array<{
    options: Record<string, TrackerValue>,
    current: string,
    feature: string
  }> = [];

  private indices: Record<string, number> = {};

  constructor(private layer: string) {}

  private get currentEntry(): typeof this.history[number] {
    return this.history[this.history.length - 1];
  }

  get current(): Optional<TrackerValue> {
    return this.currentEntry.options[this.currentEntry.current];
  }

  get currentFeature(): Optional<string> {
    return this.currentEntry.feature;
  }

  feed(options: Record<string, TrackerValue>, feature: string = `initial`) {
    // in the future could this cache this.history before clearing?
    // so that it can be restored later on if the initial entry is ever
    // reset to the same thing
    this.revert(null);
    this.insert(options, feature);
  }

  revert(feature: string | null) {
    if (feature === null) {
      this.history.length = 0;
      return;
    }
    const idx = this.indices[feature];
    if (idx === undefined || idx >= this.history.length) {
      throw new Error(`Invalid feature selected`);
    }
    this.history.splice(0, idx + 1);
  }

  select(feature: string, option: string) {
    this.revert(feature);
    if (!Object.hasOwnProperty.call(this.currentEntry.options, option)) {
      throw new Error(
        `No option '${option}' for feature ${this.currentEntry.feature}${
        ``
        }, only ${JSON.stringify(this.currentEntry.options)}`,
      );
    }
    this.currentEntry.current = option;
  }

  insert(options: Record<string, TrackerValue>, feature: string) {
    this.indices[feature] = this.history.length;
    this.history.push({
      options,
      current: Object.keys(options)[0],
      feature,
    });
  }
}

class TrackerLayer {
  private history: TransformHistory;
  private environmentCache: Record<`${Direction}${string}`, Optional<TrackerLayer>> = {};
  private dependents: Map<TrackerLayer, Array<`${Direction}${string}`>> = new Map();
  private environment: Record<`${Direction}${string}`, TrackerLayer | null> = {};

  constructor(
    public name: string,
    private rules: [string, Rule[]][],
    private parent: Tracker,
  ) {
    this.history = new TransformHistory(this.name);
    // this could do w/o the outer loop for speed but i think typescript doesn't
    // understand when you try to define a getter/setter with Object.defineProperties()
    Object.values(Direction).forEach(dir => {
      parent.layers.layers[name].types.reduce(
        (o, type) => Object.defineProperty(
          o,
          `${dir}${type}`,
          {
            get: () => this.fetchDependency(dir, type) ?? null,
            enumerable: true,
          },
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

  // name means to apply IntoSpec not to 'apply into [a] spec'
  // specifically, call if it's a function and turn it into a TrackerList(? or just List<Tracker>) if array
  applyIntoSpec<I extends IntoSpec>(
    intoSpec: I,
    from: any,
    abc: ABC.AnyAlphabet,
  ): Record<keyof I, TrackerValue> {
    return Object.fromEntries(
      Object.entries(intoSpec).map(([k, v]) => {
        let anchor: any = ANCHOR;
        const val = v instanceof Function ? v(
          from,
          (value: any = anchor) => { anchor = value; return value; },
          abc,
        ) : v;
        if (Array.isArray(val)) {
          const anchorIdx = val.findIndex(target => anchor === target);

          if (anchorIdx > 1) {
            const beforeList: List<Tracker> = new List();
            val.slice(undefined, anchorIdx).forEach(e => beforeList.append(
              new Tracker(this.parent.layers, this.parent.rules, beforeList.tail ?? this.parent, this.parent)
              .feed(this.name, e),
            ));
            beforeList.head!.prev = this.parent.prev;
            this.parent.prev = beforeList.tail;
            beforeList.tail!.next = this.parent;
          }

          if (anchorIdx < val.length - 2) {
            const afterList: List<Tracker> = new List();
            val.slice(anchorIdx + 1).forEach(e => afterList.append(
              new Tracker(this.parent.layers, this.parent.rules, afterList.tail ?? this.parent, this.parent)
                .feed(this.name, e),
            ));
            afterList.tail!.next = this.parent.next;
            this.parent.next = afterList.head;
            afterList.head!.prev = this.parent;
          }

          return [k, anchor === ANCHOR ? null : anchor];
        }
        return [k, val];
      }),
    ) as any; // idk it was complaining about k: string and not accepting any assertion of keyof I
  }

  fetchDependency(dir: Direction, type: Optional<string>): Optional<TrackerLayer> {
    const dirType: `${Direction}${string}` = `${dir}${type ?? ``}`;
    if (this.environmentCache[dirType] === undefined) {
      this.environmentCache[dirType] = this.findDependency(dir, type);
    }
    return this.environmentCache[dirType];
  }

  matches(obj: any): boolean {
    return match({
      spec: this.current,
      env: {
        ...Object.fromEntries(
          Object.keys(this.environment).map(k => [
            k,
            (o: any) => this.environment[k as `${Direction}${string}`]?.matches(o),
          ]),
        ),
        was: (o: Record<string, any>) => this.parent.was(o),
      },
    }).matches(obj);
  }

  findDependency(dir: Direction, type: Optional<string>, includeSelf = false): Optional<TrackerLayer> {
    if (!includeSelf) {
      return this[dir]?.findDependency(dir, type, true);
    }
    if (this.current && type === undefined) {
      return this;
    }
    return this.matches({spec: {type}}) ? this : this[dir]?.findDependency(dir, type, true);
  }

  select(feature: string, option: string) {
    this.history.select(feature, option);
    this.applyRules();
  }

  applyRules() {
    this.rules.forEach(([feature, rules]) => {
      rules.forEach(rule => {
        if (!this.matches({spec: rule.from, env: rule.where})) {
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
    this.invalidateDependents();
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
    public root: Optional<Tracker> = undefined,
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

  getValue(layer: string): Optional<TrackerLayer> {
    const layerValue = this.layerValues[layer];
    if (!layerValue || layerValue.current === null) {
      return undefined;
    }
    return layerValue;
  }

  nextOnLayer(layer: string, includeSelf = false): Optional<TrackerLayer> {
    if (!includeSelf) {
      return this.next?.nextOnLayer(layer, true);
    }
    return this.getValue(layer) ?? this.next?.nextOnLayer(layer, true);
  }

  prevOnLayer(layer: string, includeSelf = false): Optional<TrackerLayer> {
    if (!includeSelf) {
      return this.prev?.prevOnLayer(layer, true);
    }
    return this.getValue(layer) ?? this.prev?.prevOnLayer(layer, true);
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

  was(layers: Record<string, any>): boolean {
    const foreignEntries: typeof layers = {};
    const allOK = Object.entries(layers).every(([layer, v]) => {
      if (!this.getValue(layer)) {
        foreignEntries[layer] = v;
        return true;
      }
      return this.getValue(layer)!.matches({spec: v});
    });
    if (!allOK) {
      return false;
    }
    if (Object.keys(foreignEntries).length) {
      // FIXME: this is a contradiction in the edge case that there's no root but there are foreign entries
      return this.root?.was(foreignEntries) ?? true;
    }
    return true;
  }
}
