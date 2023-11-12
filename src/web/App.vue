<script setup lang="ts">

import rulePacks from 'src/languages/levantine/rule-packs/north-levantine/';

import {letters} from 'src/languages/levantine/alphabets/underlying';

import * as selfProfile from 'src/languages/levantine/profiles/self';
import * as rassiProfile from 'src/languages/levantine/profiles/salam-el-rassi';
import * as debug from 'src/languages/levantine/profiles/test.debugwhen';
import {type Alphabet} from 'src/lib/alphabet';
import {matchers} from 'src/lib/utils/match';

import {templates, underlying, phonic} from 'src/languages/levantine/alphabets';
import sharedOdds from 'src/lib/rules/odds';
import {unfuncSpec} from 'src/lib/rules/funcs';
import {type KeysNotMatching} from 'src/lib/utils/typetools';
import {type Ref, reactive, ref, toRaw} from 'vue';
import * as vNG from 'v-network-graph';
import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout";
import {withFlags} from 'src/languages/levantine/alphabets/templates/templates';
import {create} from 'domain';
import {spec} from 'node:test/reporters';
window.toRaw = toRaw;
let waiting: Ref<string | null> = ref(null);

async function debugStep(place?: string, ...highlight: ReadonlyArray<number>) {
  waiting.value = place ?? `Step`;
  highlight.filter(n => n >= 0).forEach(id => { nodes[`node${id}`].highlight = true; });
  // const timeout = setTimeout(() => { waiting.value = null; }, speed.value * multiplier.value);
  while (waiting.value) {
    await new Promise<void>(resolve => setTimeout(resolve, 50));
  }
  // clearTimeout(timeout);
  highlight.filter(n => n >= 0).forEach(id => { nodes[`node${id}`].highlight = false; });
  waiting.value = null;
}

async function awaitStep(place?: string, ...highlight: ReadonlyArray<number>) {
  waiting.value = place ?? `Step`;
  highlight.filter(n => n > 0).forEach(id => { nodes[`node${id}`].highlight = true; });
  const timeout = setTimeout(() => { waiting.value = null; }, speed.value * multiplier.value);
  while (waiting.value) {
    await new Promise<void>(resolve => setTimeout(resolve, 50));
  }
  clearTimeout(timeout);
  highlight.filter(n => n > 0).forEach(id => { nodes[`node${id}`].highlight = false; });
  waiting.value = null;
}

interface vNode extends vNG.Node {
  // size: number
  color: string
  label?: boolean
  self: object
  highlight?: boolean
}

interface vEdge extends vNG.Edge {
  // width: number
  color: string
  dashed?: boolean
}


const nodes: Record<string, vNode> = reactive({});
const edges: Record<string, vEdge> = reactive({});
window.nodes = nodes;
window.edges = edges;
const configs = reactive(
  vNG.defineConfigs<vNode, vEdge>({
    view: {
      scalingObjects: true,
      layoutHandler: new ForceLayout({
        positionFixedByDrag: false,
        positionFixedByClickWithAltKey: true,
        createSimulation: (d3, nodes, edges) => {
          // d3-force parameters
          const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id);
          return d3
            .forceSimulation(nodes)
            .force(`edge`, forceLink.distance(80).strength(1))
            .force(`charge`, d3.forceManyBody().strength(-5000))
            .force(`center`, d3.forceCenter().strength(0.2))
            // .force(`collide`, d3.forceCollide(3).strength(5))
            .alphaMin(0.001);

          // * The following are the default parameters for the simulation.
          // const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
          // return d3
          //   .forceSimulation(nodes)
          //   .force("edge", forceLink.distance(100))
          //   .force("charge", d3.forceManyBody())
          //   .force("collide", d3.forceCollide(50).strength(0.2))
          //   .force("center", d3.forceCenter().strength(0.05))
          //   .alphaMin(0.001)
        },
      }),
    },
    node: {
      normal: {
        type: `circle`,
        radius: node => 32 + 5 * +(node.highlight ?? 0),
        // radius: node => node.size, // Use the value of each node object
        color: node => node.highlight ? `#eee` : node.color,
        strokeWidth: node => 10 * +(node.highlight ?? 0),
        strokeColor: node => node.color,
      },
      hover: {
      },
      selectable: true,
      label: {
        // visible: node => !!node.label,
        direction: `center`,
        color: node => node.highlight ? node.color : `#fff`,
        
      },
      focusring: {
        color: `darkgray`,
      },
    },
    edge: {
      normal: {
        // width: edge => edge.width, // Use the value of each edge object
        color: edge => edge.color,
        // dasharray: edge => (edge.dashed ? `4` : `0`),
      },
      marker: {
        target: {
          type: `arrow`,
          width: 4,
          height: 4,
          margin: -1,
          offset: 0,
          units: `strokeWidth`,
          color: null,
        },
      },
    },
  })
);
let nodeID = 0;

// Object.values(rulePacks).forEach(v => Object.values(v.rulePacks).forEach(v => console.log((v))));

function _flattenProfile(profile: object): ReadonlyArray<object> {
  if (Array.isArray(profile)) {
    return profile;
  }
  return Object.values(profile).map(_flattenProfile);
}

function flattenProfile(profile: object): ReadonlyArray<Record<`for` | `into` | `source` | `odds`, object>> {
  return _flattenProfile(profile).flat(Infinity) as never;
}

function processDefaults(defaults: object, array: Array<object> = []): ReadonlyArray<Record<`for` | `into` | `source` | `odds`, object>> {
  if (defaults instanceof Function) {
    array.push(defaults());
  } else {
    Object.values(defaults).forEach(sources => processDefaults(sources, array));
  }
  return array as never;
}

function mapToSource(profile: object, defaults: object) {
  const map = new Map<object, Array<{rule: object, after: object | null}>>();
  let lastRule: {source: unknown} | null = null;
  flattenProfile(profile).forEach(rule => {
    if (!map.has(rule.source)) {
      map.set(rule.source, [{rule, after: null}]);
    } else {
      map.get(rule.source)!.push({
        rule,
        after: lastRule?.source === rule.source ? null : lastRule,
      });
    }
    lastRule = rule;
  });
  lastRule = null;
  processDefaults(defaults).forEach(rule => {
    if (!map.has(rule.source)) {
      map.set(rule.source, [{rule, after: null}]);
    } else {
      map.get(rule.source)!.push({
        rule,
        after: lastRule?.source === rule.source ? null : lastRule,
      });
    }
    lastRule = rule;
  });
  return map;
}

function orderRules(
  sources: object,
  sourceMap: ReturnType<typeof mapToSource>,
  array: Array<object> = [],
  delayQueue: Map<object, Array<object>> = new Map()
) {
  if (sources instanceof Function && `source` in sources) {
    const rules = sourceMap.get(sources.source as object);
    if (rules !== undefined) {
      rules.forEach(rule => {
        if (rule.after === null) {
          array.push(rule.rule);
        } else {
          if (delayQueue.has(rule.after)) {
            delayQueue.get(rule.after)!.push(rule.rule);
          } else {
            delayQueue.set(rule.after, [rule.rule]);
          }
        }
        if (delayQueue.has(rule.rule)) {
          array.push(...delayQueue.get(rule.rule)!);
          delayQueue.delete(rule.rule);
        }
      });
    }
  } else {
    Object.entries(sources)
      .filter(([k]) => k !== `defaults`)
      .forEach(([_, r]) => orderRules(r, sourceMap, array, delayQueue));
  }
  return array;
}

// Object.values(selfProfile).map(v => v.map(x => x));

// console.log(flattenProfile(selfProfile));

// console.log(flattenProfile(debug));
// console.log(mapToSource(selfProfile, rulePacks.templates.rulePacks.underlying.defaults));
// console.log(orderRules(rulePacks.templates.rulePacks.underlying, mapToSource(selfProfile, rulePacks.templates.rulePacks.underlying.defaults)));
// console.log(orderRules(rulePacks.templates.rulePacks.underlying, mapToSource(debug, {})));

const input = <const>[
  {type: `boundary`, features: {type: `pause`}, context: {affected: false}},
  // {
  //   type: `word`, features: {
  //     string: [
  //       letters.affected.consonant.th,
  //       letters.affected.vowel.i,
  //       letters.plain.consonant.q,
  //     ],
  //   }, context: {affected: false},
  // },
  // letters.plain.affix.f,
  // {type: `boundary`, features: {type: `word`}, context: {affected: false}},
  // {
  //   type: `word`, features: {
  //     string: [
  //       letters.plain.consonant.$,
  //       letters.plain.vowel.a,
  //       letters.plain.consonant.x,
  //       letters.plain.consonant.s,
  //       letters.plain.vowel.a,
  //       letters.plain.consonant.n,
  //     ],
  //   }, context: {affected: false},
  // },
  // {type: `boundary`, features: {type: `word`}, context: {affected: false}},
  {
    type: `verb`,
    features: {
      subject: letters.plain.pronoun.mp3.features,
      tam: `past`,
      door: `fa33al`,
      theme: `u`, // doesn't matter here
      root: [
        {...letters.plain.consonant.k.features, affected: false, weak: false},
        {...letters.plain.consonant.t.features, affected: false, weak: false},
        {...letters.plain.consonant.b.features, affected: false, weak: false},
      ],
    },
    context: {affected: false},
  },
  // {type: `boundary`, features: {type: `word`}, context: {affected: false}},
  // {
  //   type: `verb`,
  //   features: {
  //     subject: letters.plain.pronoun.mp3.features,
  //     tam: `indicative`,
  //     door: `f3vl`,
  //     theme: `u`,
  //     root: [
  //       {...letters.plain.consonant.k.features, affected: false, weak: false},
  //       {...letters.plain.consonant.t.features, affected: false, weak: false},
  //       {...letters.plain.consonant.b.features, affected: false, weak: false},
  //     ],
  //   },
  //   context: {affected: false},
  // },
  {type: `boundary`, features: {type: `pause`}, context: {affected: false}},
];

window.letters = letters;

enum NodeType {
  /** Uninitialized */
  blank,
  /** Permanent node that shows up in 'was' searches */
  fixture,
  /** 'Mock' node that does not show up in 'was' searches */
  mock,
}

enum ChildType {
  main,
  /** Connection hub for coalesce operation */
  coalesce,
  /** Result of preject operation */
  preject,
  /** Result of postject operation */
  postject,
}

function update(a: object, b: object): object {
  return Object.fromEntries([...Object.keys(a), ...Object.keys(b)].map(k => [
    k,
    !(k in b)
      ? a[k as never]
      : !(k in a)
        ? b[k as never]
        : typeof a[k as never] === `object` && a[k as never] !== null
          ? update(a[k as never], b[k as never])
          : b[k as never],
  ]));
}

class Node {
  public _mainParent: Node | null = null;
  public _mainChild: Node | null = null;
  public _prev: Node | null = null;
  public _next: Node | null = null;

  public subscribers: Set<Node> = new Set();
  public createdBy: {for: unknown, into: unknown, odds: unknown} | null = null;

  public waitingOnTarget: boolean = false;

  public id: number;

  // usableYet is for nodes that could be checked by target
  public usableYet: boolean = false;
  public erased: boolean = false;

  constructor(
    public rules: Record<string, Record<string, ReadonlyArray<{for: object, into: object, odds: ReturnType<ReturnType<typeof sharedOdds>>}>>>,
    public layer: Alphabet,
    public type: NodeType,
    public childType: ChildType | null,
    public _value: {type: string, features: object, context: object} | undefined | null,
    environment?: {
      mainParent?: Node[`mainParent`],
      mainChild?: Node[`mainChild`],
      prev?: Node[`prev`],
      next?: Node[`next`],
    }
  ) {
    this.id = nodeID++;
    nodes[`node${this.id}`] = {self: this, name: this.value?.type ? `${this.value.type}\n${this.id}` : `${this.id}`, color: this.layer.name === `templates` ? `blue` : this.layer.name === `underlying` ? `maroon` : this.layer.name === `phonic` ? `#a17f1a` : `black`};
    if (environment) {
      Object.entries(environment).forEach(([k, v]) => {
        // @ts-expect-error Assigning to properties (mainParent, mainChild, prev, next) dynamically
        this[k] = v;
      });
    }
    // commenting out bc this should be handled after every generation by the engine instead of here
    // if (this.mainParent !== null) {
    //   if (!this.next) {
    //     this.next = this.mainParent.nextCousinOf(this);
    //   }
    //   if (!this.prev) {
    //     this.prev = this.mainParent.prevCousinOf(this);
    //   }
    // }
    if (this.mainChild && (this.mainChild.mainParent === null || this.mainChild.mainParent === this.mainParent)) {
      this.mainChild.mainParent = this;
    }
    if (this.mainParent && (this.mainParent.mainChild === null || this.mainParent.mainChild === this.mainChild)) {
      this.mainParent.mainChild = this;
    }
  }

  usable(): this {
    this.usableYet = true;
    return this;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    nodes[`node${this.id}`].name = value?.type ? `${value.type}\n${this.id}` : `${this.id}`;
  }

  get mainChild() {
    return this._mainChild;
  }

  set mainChild(node) {
    if (this._mainChild !== null) {
      delete edges[`edge${this.id}-${this._mainChild.id}`];
    }
    if (node !== null) {
      edges[`edge${this.id}-${node.id}`] = {source: `node${this.id}`, target: `node${node.id}`, color: `black`};
    }
    this._mainChild = node;
  }
  
  get mainParent() {
    return this._mainParent;
  }

  set mainParent(node) {
    if (this._mainParent !== null) {
      delete edges[`edge${this.id}-${this._mainParent.id}`];
    }
    if (node !== null) {
      edges[`edge${this.id}-${node.id}`] = {source: `node${this.id}`, target: `node${node.id}`, color: `dodgerblue`};
    }
    this._mainParent = node;
  }

  get prev() {
    return this._prev;
  }

  set prev(node) {
    if (this._prev !== null) {
      delete edges[`edge${this.id}-${this._prev.id}`];
    }
    if (node !== null) {
      edges[`edge${this.id}-${node.id}`] = {source: `node${this.id}`, target: `node${node.id}`, color: `red`};
    }
    this._prev = node;
  }

  get next() {
    return this._next;
  }

  set next(node: Node | null) {
    if (this._next !== null) {
      delete edges[`edge${this.id}-${this._next.id}`];
    }
    if (node !== null) {
      edges[`edge${this.id}-${node.id}`] = {source: `node${this.id}`, target: `node${node.id}`, color: `green`};
    }
    this._next = node;
  }

  copy(node: Node, fix: {[K in KeysNotMatching<Node, (...args: never) => unknown>]?: Node[K]} = {}) {
    if (node.next) {
      node.next.prev = this;
    }
    if (node.prev) {
      node.prev.next = this;
    }
    if (node.mainParent?.mainChild === node) {
      let parent = node.firstParent();
      const lastParent = node.lastParent();
      while (parent && parent !== lastParent) {
        parent.mainChild = this;
        parent = parent.next;
      }
    }
    if (node.mainChild?.mainParent === node) {
      let child = node.firstChild();
      const lastChild = node.lastChild();
      while (child && child !== lastChild) {
        child.mainParent = this;
        child = child.next;
      }
    }
    node.subscribers.forEach(this.subscribe);

    this.mainParent = `mainParent` in fix ? fix.mainParent : node.mainParent;
    this.mainChild = `mainChild` in fix ? fix.mainChild : node.mainChild;
    this.prev = `prev` in fix ? fix.prev : node.prev;
    this.next = `next` in fix ? fix.next : node.next;
    this.createdBy = `createdBy` in fix ? fix.createdBy : node.createdBy;
    this.rules = `rules` in fix ? fix.rules : node.rules;
    this.layer = `layer` in fix ? fix.layer : node.layer;
    this.type = `type` in fix ? fix.type : node.type;
    this.childType = `childType` in fix ? fix.childType : node.childType;
    this.value = `value` in fix ? fix.value : node.value;
    this.erased = `erased` in fix ? fix.erased : node.erased;
    this.usableYet = `usableYet` in fix ? fix.usableYet : node.usableYet;
    // this.waitingOnTarget = node.waitingOnTarget;  // should just be false tbh

    node.next = null;
    node.prev = null;
    node.mainParent = null;
    node.mainChild = null;

    // update the debug graph
    delete nodes[`node${this.id}`];
    this.id = node.id;
    nodes[`node${this.id}`] = {self: this, name: this.value?.type ? `${this.value.type}\n${this.id}` : `${this.id}`, color: this.layer.name === `templates` ? `blue` : this.layer.name === `underlying` ? `maroon` : this.layer.name === `phonic` ? `#a17f1a` : `black`};
    // eslint-disable-next-line no-self-assign
    this.next = this.next;
    // eslint-disable-next-line no-self-assign
    this.prev = this.prev;
    // eslint-disable-next-line no-self-assign
    this.mainParent = this.mainParent;
    // eslint-disable-next-line no-self-assign
    this.mainChild = this.mainChild;
    if (this.next) {
      this.next.prev = this;
    }
    if (this.prev) {
      this.prev.next = this;
    }
    for (const parent of this.parents()) {
      parent.mainChild = this;
    }
    for (const child of this.children()) {
      child.mainParent = this;
    }
    for (const subscriber of this.subscribers) {
      this.subscribe(subscriber);
    }
  }

  blank() {
    this.mainParent = null;
    this.mainChild = null;
    this.prev = null;
    this.next = null;
    // this.subscribers.clear();  // ?
    this.createdBy = null;
    // this.rules = 
    // this.layer = 
    this.type = NodeType.blank;
    this.childType = ChildType.main;
    this.value = undefined;
  }

  /* properties */
  firstSibling() {
    return this.backseek(node => node.prev === null || node.prev.mainParent !== this.mainParent) ?? this;
  }

  lastSibling() {
    return this.foreseek(node => node.next === null || node.next.mainParent !== this.mainParent) ?? this;
  }

  firstChild() {
    if (this.mainChild === null) {
      return null;
    }
    return this.mainChild.firstSibling();
  }

  lastChild() {
    if (this.mainChild === null) {
      return null;
    }
    return this.mainChild.lastSibling();
  }

  prejectBoundary() {
    return this.backseek(
      node => node.prev === null || ((node.prev.childType === ChildType.preject) != (node.prev.mainParent !== this.mainParent))
    ) ?? this.firstSibling();
  }

  postjectBoundary() {
    return this.foreseek(
      node => node.next === null || ((node.next.childType === ChildType.postject) != (node.next.mainParent !== this.mainParent))
    ) ?? this.lastSibling();
  }

  children() {
    const arr: Array<Node> = [];
    if (this.mainChild !== null) {
      const lastChild = this.lastChild();
      this.firstChild()!.foreseek(node => {
        arr.push(node);
        return node === lastChild;
      });
    }
    return arr;
  }

  firstParent() {
    if (this.mainParent === null) {
      return null;
    }
    return this.mainParent.backseek(node => node.prev === null || node.prev.mainChild !== this) ?? null;
  }

  lastParent() {
    if (this.mainParent === null) {
      return null;
    }
    return this.mainParent.foreseek(node => node.next === null || node.next.mainChild !== this) ?? null;
  }

  parents() {
    const arr: Array<Node> = [];
    if (this.mainParent !== null) {
      const lastParent = this.lastParent();
      this.firstParent()!.foreseek(node => {
        arr.push(node);
        return node === lastParent;
      });
    }
    return arr;
  }

  nextCousinOf(node: Node): Node | null {
    if (this.mainChild !== node) {
      return this.firstChild();
    }
    return this.next?.nextCousinOf(node) ?? null;
  }

  prevCousinOf(node: Node): Node | null {
    if (this.mainChild !== node) {
      return this.lastChild();
    }
    return this.next?.prevCousinOf(node) ?? null;
  }

  /* initialization */
  populateListChildren(targets: ReadonlyArray<Alphabet>) {
    if (!targets.length) {
      return;
    }
    const [target, ...rest] = targets;
    if (this.mainChild === null) {
      // propagates boundaries and other shared stuff
      // (this will also get consonants and vowels i think...
      // and because match lib doesn't care about missing properties it
      // may just work out fine for ones that don't end up getting properly transformed??)
      const value = this.value === null ? this.value : (
        this.value !== undefined
          && this.value.type in target.types
          && matchers.single(target.types[this.value.type], this.value.features)
      ) ? this.value
        : undefined;
      this.mainChild = new Node(
        this.rules,
        target,
        NodeType.blank,
        ChildType.main,
        value,
        {mainParent: this},
      ).usable();
      // this.subscribe(this.mainChild);
    }
    if (this.next !== null) {
      this.next.populateListChildren(targets);
      this.mainChild.next = this.next.mainChild;
      if (this.next.mainChild) {
        this.next.mainChild.prev = this.mainChild;
      }
    }
    if (this.prev === null) {
      this.mainChild.populateListChildren(rest);
    }
  }

  async connectLeaders(last: Node | null = null): Promise<Node | null> {
    // if (this.type === NodeType.blank && this.value !== undefined && this.value === this.mainParent?.value) {
    //   this.type = NodeType.fixture;
    // }
    // await debugStep(`starting connectleaders from ${this.id}`, this.id, last?.id ?? -1);
    if (last !== null) {
      last.next = this;
      this.prev = last;
    }
    // await debugStep(`handled last`);
    const passForward = this.mainChild === null || this.mainChild.layer !== this.layer
      ? this
      : await this.mainChild.connectLeaders(last);
    // await debugStep(`retrieved passForward for ${this.id}`, this.id, passForward?.id ?? -1);
    if (this.next !== null && this.next.mainParent !== null && this.next.mainParent.layer === this.layer && this.next.mainParent !== this.mainParent) {
      // await debugStep(`returning null from ${this.id} because of ${this.next.id}`, this.next.id);
      return null;
    }
    // await debugStep(`checking ${this.next?.id ?? `nothing much`} for ${this.id}`, this.id, this.next?.id ?? -1);
    return this.next === null || this.next === this.mainChild?.next ? this : await this.next.connectLeaders(passForward);
  }

  async extrudeLeaders(recurse = true) {
    await awaitStep(`uhhhh extruding from ${this.id}`, this.id);
    if (recurse && this !== this.seekLeader()) {
      await this.seekLeader().extrudeLeaders();
      return;
    }
    if (this.mainChild === null) {
      if (this.prev === null) {
        const connection = this.foreseek(node => node.mainChild !== null)?.mainChild;
        if (connection) {
          // see above comment (ctrl+F consonants)
          const value = this.value === null ? this.value : (
            this.value !== undefined
              && this.value.type in connection.layer.types
              && matchers.single(connection.layer.types[this.value.type], this.value.features)
          ) ? this.value
            : undefined;
          connection.prev = new Node(
            this.rules,
            connection.layer,
            NodeType.blank,
            ChildType.main,
            value,
            {mainParent: this, next: connection},
          ).usable();
          connection.prev.createdBy = `extrusion` as never;
          // await awaitStep(`created a node`, connection.prev.id);
        } else {
          this.mainChild = new Node(
            this.rules,
            this.layer,
            NodeType.blank,
            ChildType.main,
            this.value,
            {mainParent: this}
          );
          this.mainChild.createdBy = `extrusion` as never;
          // await awaitStep(`created a node`, this.mainChild.id);
        }
      } else if (this.prev.mainChild !== null) {
        const connection = this.prev.mainChild;
        // see above comment (ctrl+F consonants)
        const value = this.value === null ? this.value : (
          this.value !== undefined
            && this.value.type in connection.layer.types
            && matchers.single(connection.layer.types[this.value.type], this.value.features)
        ) ? this.value
          : undefined;
        const oldNext = connection.next;
        connection.next = new Node(
          this.rules,
          connection.layer,
          NodeType.blank,
          ChildType.main,
          value,
          {mainParent: this, prev: connection, next: connection.next}
        ).usable();
        connection.next.createdBy = `extrusion` as never;
        // await awaitStep(`created a node`, connection.next.id);
        if (oldNext) {
          oldNext.prev = connection.next;
        }
      }
    }
    if (recurse) {
      let node = this.next;
      while (node) {
        await node.extrudeLeaders(false);
        node = node.next;
      }
    }
  }

  async fillInTheBlanks() {
    // if (this.mainChild !== null && this.mainChild.layer === this.layer) {
    //   await this.seekLeader().fillInTheBlanks();
    //   return;
    // }
    if (this.next === null) {
      return;
    }
    if (this.value === undefined && this.type === NodeType.blank) {
      this.value = this.mainParent?.value;
    }
    this.next.fillInTheBlanks();
  }

  seekLeader(): Node {
    if (this.mainChild === null || this.mainChild.layer !== this.layer) {
      return this.firstSibling();
    }
    return this.mainChild.firstSibling().seekLeader();
  }

  leaders(): ReadonlyArray<Node> {
    let leaders: ReadonlyArray<Node> = [this];
    let allDone = false;
    while (!allDone) {
      leaders = leaders.map(node => {
        if (node.mainChild === null || node.mainChild.layer !== node.layer) {
          allDone = allDone && true;
          return node;
        }
        allDone = false;
        return node.children();
      }).flat();
      allDone = true;
    }
    return leaders;
  }

  /** :( */
  orphanSiblings() {
    this.prev = this.firstSibling()?.prev ?? null;
    this.next = this.lastSibling()?.next ?? null;
    if (this.prev) {
      this.prev.next = this;
    }
    if (this.next) {
      this.next.prev = this;
    }
  }

  async wipeChildren() {
    while (this.mainChild !== null && this.mainChild.layer === this.layer && this.mainChild.type !== NodeType.blank) {
      this.mainChild.orphanSiblings();
      this.mainChild = this.mainChild.mainChild;
    }
    if (this.mainChild === null) {
      return;
    }
    // this.mainChild.type = NodeType.blank;
    // this.mainChild.value = undefined;
    await this.mainChild.wipeChildren();
  }

  /* list ops */
  backseek(predicate: (node: Node) => boolean): Node | null {
    if (predicate(this)) {
      return this;
    }
    if (this.prev === null) {
      return null;
    }
    return this.prev.backseek(predicate);
  }

  foreseek(predicate: (node: Node) => boolean): Node | null {
    if (predicate(this)) {
      return this;
    }
    if (this.next === null) {
      return null;
    }
    return this.next.foreseek(predicate);
  }

  /* events */
  subscribe(node: Node) {
    if (node === this) {
      return;
    }
    edges[`subscription${node.id}-${this.id}`] = {source: `node${node.id}`, target: `node${this.id}`, color: `lavender`};
    this.subscribers.add(node);
  }

  /**
   * Bro! You just posted cringe!
   */
  looseSubscriber() {
    this.subscribers.clear();
  }

  async isEpenthesis(specs: object): Promise<boolean> {
    if (`match` in specs && `value` in specs) {
      switch (specs.match) {
        case `not`:
          return !await this.isEpenthesis(specs.value as object);
        case `all`:
        case `any`:
          for (const v of specs.value as ReadonlyArray<object>) {
            if (await this.isEpenthesis(v)) {
              return true;
            }
          }
          return false;
        // return (specs.value as ReadonlyArray<object>).some(v => this.checkSpecs(v, subscriber));
        // does a custom match even make sense up at this level?
        // don't think others do at any rate
        default:
          throw new Error(`Unimplemented match for checkSpecs(): ${specs.match}`);
      }
    }
    return `spec` in specs && specs.spec === null;
  }

  /* specs stuff */
  async checkSpecs(specs: object, subscriber: Node | null = this): Promise<boolean> {
    // if (subscriber.id !== this.id) {
    //   await awaitStep(`checking specs of ${this.id} for ${subscriber.id}`, this.id, subscriber.id);
    // }
    if (specs === null && this.value === null) {
      // it'd probably be handled correctly below but just in case lmao
      return true;
    }
    if (`match` in specs && `value` in specs) {
      switch (specs.match) {
        case `not`:
          return !await this.checkSpecs(specs.value as object, subscriber);
        case `all`:
          for (const v of specs.value as ReadonlyArray<object>) {
            if (!await this.checkSpecs(v, subscriber)) {
              return false;
            }
          }
          return true;
          // return (specs.value as ReadonlyArray<object>).every(v => this.checkSpecs(v, subscriber));
        case `any`:
          for (const v of specs.value as ReadonlyArray<object>) {
            if (await this.checkSpecs(v, subscriber)) {
              return true;
            }
          }
          return false;
        // return (specs.value as ReadonlyArray<object>).some(v => this.checkSpecs(v, subscriber));
        // does a custom match even make sense up at this level?
        // don't think others do at any rate
        default:
          throw new Error(`Unimplemented match for checkSpecs(): ${specs.match}`);
      }
    }
    if (this.type === NodeType.blank && subscriber !== this) {
      return false;
    }
    // console.log(specs);
    for (const [k, v] of Object.entries(specs)) {
      switch (k) {
        case `spec`:
          if (!await this.checkSpec(v, subscriber)) {
            return false;
          }
          continue;
        case `env`:
          if (!await this.checkEnv(v, subscriber)) {
            return false;
          }
          continue;
        case `was`:
          if (!await this.checkWas(v, subscriber)) {
            return false;
          }
          continue;
        case `target`:
          if (!await this.checkTarget(v, subscriber)) {
            return false;
          }
          continue;
      }
    }
    return true;
    // return Object.entries(specs).every(([k, v]) => {
    //   switch (k) {
    //     case `spec`:
    //       return this.checkSpec(v, subscriber);
    //     case `env`:
    //       return this.checkEnv(v, subscriber);
    //     case `was`:
    //       return await this.checkWas(v, subscriber);
    //     case `target`:
    //       return this.checkTarget(v, subscriber);
    //     default:
    //       throw new Error(`Unimplemented for checkSpecs(): ${k} from that^`);
    //   }
    // });
  }

  async checkSpec(spec: object, subscriber: Node | null): Promise<boolean> {
    if (subscriber) {
      this.subscribe(subscriber);
    }
    return this.usableYet && matchers.single(spec as never, this.value);
  }

  // this is so ugly
  async collectEnv(
    specs: object,
    subscriber: Node | null = this,
    collected: {next: Node[], prev: Node[]} = {next: [], prev: []},
  ): Promise<typeof collected> {
    if (`match` in specs && `value` in specs) {
      switch (specs.match) {
        case `not`:
          return await this.collectEnv(specs.value as object, subscriber, collected);
        case `all`:
        case `any`:
          for (const v of specs.value as ReadonlyArray<object>) {
            await this.collectEnv(v, subscriber, collected);
          }
          // (specs.value as ReadonlyArray<object>).forEach(v => this.collectEnv(v, subscriber, collected));
          return collected;
        // does a custom match even make sense up at this level?
        // don't think others do at any rate
        default:
          throw new Error(`Unimplemented match for collectEnv(): ${specs.match}`);
      }
    }
    if (`env` in specs) {
      await this.checkEnv(specs.env as object, subscriber, collected);
    }
    // Object.entries(specs).forEach(([k, v]) => {
    //   if (k === `env`) {
    //     this.checkEnv(v, subscriber, collected);
    //   }
    // });
    return collected;
  }

  // this is even uglier lmfao
  async collectEnvSeparate(
    specs: object,
    subscriber: Node | null = this,
    collected: {next: Node[], prev: Node[]} = {next: [], prev: []},
  ): Promise<{next: boolean, prev: boolean}> {
    // await debugStep(`checking for epenthetic env`, this.id);
    if (`match` in specs && `value` in specs) {
      switch (specs.match) {
        case `not`: {
          const {next, prev} = await this.collectEnvSeparate(specs.value as object, subscriber, collected);
          return {next: !next, prev: !prev};
        }
        case `all`: {
          let valid = {next: true, prev: true};
          for (const v of specs.value as ReadonlyArray<object>) {
            const {next, prev} = await this.collectEnvSeparate(v, subscriber, collected);
            if (!next) {
              valid.next = false;
            }
            if (!prev) {
              valid.prev = false;
            }
          }
          // (specs.value as ReadonlyArray<object>).forEach(v => this.collectEnv(v, subscriber, collected));
          return valid;
        }
        case `any`: {
          let valid = {next: false, prev: false};
          for (const v of specs.value as ReadonlyArray<object>) {
            const {next, prev} = await this.collectEnvSeparate(v, subscriber, collected);
            if (next) {
              valid.next = true;
            }
            if (prev) {
              valid.prev = true;
            }
          }
          // (specs.value as ReadonlyArray<object>).forEach(v => this.collectEnv(v, subscriber, collected));
          return valid;
        }
        // does a custom match even make sense up at this level?
        // don't think others do at any rate
        default:
          throw new Error(`Unimplemented match for collectEnvSeparate(): ${specs.match}`);
      }
    }
    if (`env` in specs) {
      // console.log(specs);
      return await this.checkEnvSeparate(specs.env as object, subscriber, collected);
      // await debugStep(`it literally dun work`, this.id);
    }
    // Object.entries(specs).forEach(([k, v]) => {
    //   if (k === `env`) {
    //     this.checkEnv(v, subscriber, collected);
    //   }
    // });
    // console.log(specs, collected);
    // await debugStep(`it literally do work`, this.id);
    return {next: false, prev: false};
  }

  async _checkEnvPrev(
    env: ReadonlyArray<object>,
    subscriber: Node | null,
    collectedEnv: Record<`next` | `prev`, Array<Node | null>>
  ): Promise<boolean> {
    let node = this.prev;
    let index = 0;

    let checkingArray = false;
    let arrayLengthSoFar = -1;
    let arrayCheckForValue: object | null = null;
    let checkArrayEndAt: ReadonlyArray<number> | -1 = [];
    let stopCheckingArrayAt = Infinity;

    for (const specs of env) {
      while (checkingArray) {
        if (!await node?.checkSpecs(arrayCheckForValue!, subscriber)) {
          checkingArray = false;
          if (checkArrayEndAt !== -1 && !checkArrayEndAt.includes(arrayLengthSoFar)) {
            return false;
          }
        } else {
          do {
            node = node?.prev ?? null;
          } while (node && node.erased);
          collectedEnv.prev[index++] = node;
        }
        arrayLengthSoFar += 1;
        if (arrayLengthSoFar >= stopCheckingArrayAt) {
          checkingArray = false;
        }
      }

      if (`match` in specs && specs.match === `array` && `value` in specs) {
        checkingArray = true;
        const {length, fill} = specs.value as ({length: number | object, fill: object});
        arrayCheckForValue = fill;
        if (typeof length === `number`) {
          checkArrayEndAt = [length];
        } else if (`match` in length && length.match === `any` && `value` in length) {
          checkArrayEndAt = length.value as ReadonlyArray<number>;
        } else if (`match` in length && length.match === `type` && `value` in length && length.value === `number`) {
          checkArrayEndAt = -1;
        }
        stopCheckingArrayAt = checkArrayEndAt === -1 ? Infinity : Math.max(...checkArrayEndAt);
        arrayLengthSoFar = 0;
        continue;
      }

      if (!await node?.checkSpecs(specs, subscriber)) {
        return false;
      }

      do {
        node = node?.prev ?? null;
      } while (node && node.erased);
      collectedEnv.prev[index++] = node;
    }
    return true;
  }

  async _checkEnvNext(
    env: ReadonlyArray<object>,
    subscriber: Node | null,
    collectedEnv: Record<`next` | `prev`, Array<Node | null>>
  ): Promise<boolean> {
    let node = this.next;
    let index = 0;

    let checkingArray = false;
    let arrayLengthSoFar = -1;
    let arrayCheckForValue: object | null = null;
    let checkArrayEndAt: ReadonlyArray<number> | -1 = [];
    let stopCheckingArrayAt = Infinity;

    for (const specs of env) {
      while (checkingArray) {
        if (!await node?.checkSpecs(arrayCheckForValue!, subscriber)) {
          checkingArray = false;
          if (checkArrayEndAt !== -1 && !checkArrayEndAt.includes(arrayLengthSoFar)) {
            return false;
          }
        } else {
          do {
            node = node?.next ?? null;
          } while (node && node.erased);
          collectedEnv.next[index++] = node;
        }
        arrayLengthSoFar += 1;
        if (arrayLengthSoFar >= stopCheckingArrayAt) {
          checkingArray = false;
        }
      }

      if (`match` in specs && specs.match === `array` && `value` in specs) {
        checkingArray = true;
        const {length, fill} = specs.value as ({length: number | object, fill: object});
        arrayCheckForValue = fill;
        if (typeof length === `number`) {
          checkArrayEndAt = [length];
        } else if (`match` in length && length.match === `any` && `value` in length) {
          checkArrayEndAt = length.value as ReadonlyArray<number>;
        } else if (`match` in length && length.match === `type` && `value` in length && length.value === `number`) {
          checkArrayEndAt = -1;
        }
        stopCheckingArrayAt = checkArrayEndAt === -1 ? Infinity : Math.max(...checkArrayEndAt);
        arrayLengthSoFar = 0;
        continue;
      }

      if (!await node?.checkSpecs(specs, subscriber)) {
        return false;
      }

      do {
        node = node?.next ?? null;
      } while (node && node.erased);
      collectedEnv.next[index++] = node;
    }
    return true;
  }

  async checkEnv(
    env: object,
    subscriber: Node | null,
    collectedEnv: Record<`next` | `prev`, Array<Node | null>> = {next: [], prev: []},
  ): Promise<boolean> {
    if (`match` in env && `value` in env) {
      switch (env.match) {
        case `all`:
          for (const v of env.value as ReadonlyArray<object>) {
            if (!await this.checkEnv(v, subscriber, collectedEnv)) {
              return false;
            }
          }
          return true;
          // return (env.value as ReadonlyArray<object>).every(v => this.checkEnv(v, subscriber, collectedEnv));
        case `any`:
          for (const v of env.value as ReadonlyArray<object>) {
            if (await this.checkEnv(v, subscriber, collectedEnv)) {
              return true;
            }
          }
          return false;
          // return (env.value as ReadonlyArray<object>).some(v => this.checkEnv(v, subscriber, collectedEnv));
        case `custom`:
          // `all` from custom() will have been done already by this point if i'm not wrong
          // which means collectedEnv will be populated fingers crossed
          return (env.value as (arg: unknown) => boolean)(collectedEnv);
        default:
          throw new Error(`Unimplemented match for checkEnv(): ${env.match}`);
      }
    }
    for (const [k, v] of Object.entries(env)) {
      switch (k) {
        case `next`:
          if (!await this._checkEnvNext(v.flat(Infinity), subscriber, collectedEnv)) {
            return false;
          }
          continue;
        case `prev`:
          if (!await this._checkEnvPrev(v.flat(Infinity), subscriber, collectedEnv)) {
            return false;
          }
          continue;
      }
    }
    return true;
    // return Object.entries(env).every(([k ,v]) => {
    //   switch (k) {
    //     case `next`:
    //       return this._checkEnvNext(v.flat(Infinity), subscriber, collectedEnv);
    //     case `prev`:
    //       return this._checkEnvPrev(v.flat(Infinity), subscriber, collectedEnv);
    //   }
    // });
  }

  async checkEnvSeparate(
    env: object,
    subscriber: Node | null,
    collectedEnv: Record<`next` | `prev`, Array<Node | null>> = {next: [], prev: []},
  ): Promise<{next: boolean, prev: boolean}> {
    // debugger;
    // await debugStep(`checking env man idk`, this.id);
    if (`match` in env && `value` in env) {
      switch (env.match) {
        case `not`: {
          const {next, prev} = await this.checkEnvSeparate(env.value as object, subscriber, collectedEnv);
          return {next: !next, prev: !prev};
        }
        case `all`: {
          let valid = {next: true, prev: true};
          for (const v of env.value as ReadonlyArray<object>) {
            const {next, prev} = await this.checkEnvSeparate(v, subscriber, collectedEnv);
            if (!next) {
              valid.next = false;
            }
            if (!prev) {
              valid.prev = false;
            }
          }
          // console.log(valid);
          return valid;
        }
        // return (env.value as ReadonlyArray<object>).every(v => this.checkEnv(v, subscriber, collectedEnv));
        case `any`: {
          let valid = {next: false, prev: false};
          for (const v of env.value as ReadonlyArray<object>) {
            const {next, prev} = await this.checkEnvSeparate(v, subscriber, collectedEnv);
            if (next) {
              valid.next = true;
            }
            if (prev) {
              valid.prev = true;
            }
          }
          // console.log(valid);
          return valid;
        }
        // return (env.value as ReadonlyArray<object>).some(v => this.checkEnv(v, subscriber, collectedEnv));
        case `custom`: {
        // `all` from custom() will have been done already by this point if i'm not wrong
        // which means collectedEnv will be populated fingers crossed
          const both = (env.value as (arg: unknown) => boolean)(collectedEnv);
          return {next: both, prev: both};
        }
        default:
          throw new Error(`Unimplemented match for checkEnv(): ${env.match}`);
      }
    }
    let valid = {next: true, prev: true};
    for (const [k, v] of Object.entries(env)) {
      switch (k) {
        case `next`:
          if (!await this._checkEnvNext(v.flat(Infinity), subscriber, collectedEnv)) {
            valid.next = false;
          }
          continue;
        case `prev`:
          if (!await this._checkEnvPrev(v.flat(Infinity), subscriber, collectedEnv)) {
            valid.prev = false;
          }
          continue;
      }
    }
    // console.log(valid, env);
    // await debugStep(`what did we learn`, this.id);
    return valid;
  // return Object.entries(env).every(([k ,v]) => {
  //   switch (k) {
  //     case `next`:
  //       return this._checkEnvNext(v.flat(Infinity), subscriber, collectedEnv);
  //     case `prev`:
  //       return this._checkEnvPrev(v.flat(Infinity), subscriber, collectedEnv);
  //   }
  // });
  }

  // TODO: check against the actual alphabet reference (ie layer: Alphabet, not layerName: string)
  async _checkWas(layerName: string, specs: object, subscriber: Node | null): Promise<boolean> {
    if (this.layer.name === layerName) {
      if (this.type !== NodeType.mock && await this.checkSpecs(specs, subscriber)) {
        // await awaitStep(`found`, this.id);
        // console.log(`rip`, this.type, this);
        return true;
      }
      if (this.mainParent === null || this.mainParent.layer.name !== layerName) {
        // await awaitStep(`rejected`, this.id);
        return false;
      }
    }
    // await awaitStep(`checking was`, this.id);
    for (const parent of this.parents()) {
      if (await parent._checkWas(layerName, specs, subscriber)) {
        return true;
      }
    }
    return false;
    // return this.parents().some(parent => parent._checkWas(layerName, specs, subscriber));
  }

  async checkWas(specs: object, subscriber: Node | null): Promise<boolean> {
    if (`match` in specs && `value` in specs) {
      switch (specs.match) {
        case `all`:
          for (const v of specs.value as ReadonlyArray<object>) {
            if (!await this.checkWas(v, subscriber)) {
              return false;
            }
          }
          return true;
          // return (specs.value as ReadonlyArray<object>).every(v => await this.checkWas(v, subscriber));
        case `any`:
          for (const v of specs.value as ReadonlyArray<object>) {
            if (await this.checkWas(v, subscriber)) {
              return true;
            }
          }
          return false;
          // return (specs.value as ReadonlyArray<object>).some(v => await this.checkWas(v, subscriber));
        default:
          throw new Error(`Unimplemented match for checkWas(): ${specs.match}`);
      }
    }
    // await awaitStep(`about to check was`, this.id);
    for (const [k, v] of Object.entries(specs)) {
      if (!await this._checkWas(k, v, subscriber)) {
        return false;
      }
    }
    return true;
    // return Object.entries(specs).every(([k, v]) => await this._checkWas(k, v, subscriber));
  }

  // this should only ever be called on the leading node
  // so i think .mainChild should always be the next layer's first node
  // and you don't need to seek for it or anything
  async checkTarget(specs: object, subscriber: Node | null): Promise<boolean> {
    if (this.mainChild === null) {
      // i think the type system ensures that you can't (type-safely) use target on the bottom layer
      console.error(
        `i was wrong about the type system ensuring that you can't (type-safely) use target on the bottom layer`,
        specs,
      );
      return false;
    }
    const env = await this.mainChild.collectEnv(specs, subscriber);
    if (subscriber) {
      subscriber.waitingOnTarget = (
        env.next.some(node => node.type !== NodeType.blank)
        || env.prev.some(node => node.type !== NodeType.blank)
      );
    }
    // if (subscriber.waitingOnTarget) {
    //   return false;
    // }
    // this subscribes to mainChild and/or its neighbors in the process
    // i don't even think it needs a special case for mainChild.type === NodeType.blank vs otherwise,
    // this should just work lol
    return await this.mainChild.checkSpecs(specs, subscriber);
  }

  /* transformation stuff */
  async preject(start: Node, end: Node) {
    const firstMainSibling = this.prejectBoundary();
    if (firstMainSibling.prev) {
      start.prev = firstMainSibling.prev;
      firstMainSibling.prev.next = start;
    }
    firstMainSibling.prev = end;
    end.next = firstMainSibling;
    await awaitStep(`Finish preject`);
  }

  postject(start: Node, end: Node) {
    const lastMainSibling = this.postjectBoundary();
    if (lastMainSibling.next) {
      start.next = lastMainSibling.next;
      lastMainSibling.next.prev = start;
    }
    lastMainSibling.next = end;
    end.prev = lastMainSibling;
  }

  async split(start: Node, end: Node): Promise<boolean> {
    // await awaitStep(`SPLIT`, this.id);
    end.next = this.next;
    if (this.next) {
      // await awaitStep(`NEXT`, this.id);
      this.next.prev = end;
    }
    if (this.type === NodeType.blank) {
      // await awaitStep(`COPY`, this.id);
      // await debugStep(`starting copy`);
      this.copy(start, {mainChild: this.mainChild, prev: this.prev});
      return true;
      // await debugStep(`finished copy`);
    } else {
      // await awaitStep(`NEIGHBOR`, this.id);
      this.next = start;
      start.prev = this;
    }
    return false;
    // await awaitStep(`DONE`, this.id);
  }

  async makeChildren(
    args: ReadonlyArray<object>,
    target: Alphabet,
    operation: string | null, mock: boolean,
  ): Promise<Array<Node>> {
    if (operation === `coalesce`) {
      return await this.mainChild!.makeChildren(args, target, `main`, mock);
    }
    const created: Array<Node> = [];
    if (mock || operation === `mock`) {
      args = args.map(arg => update(this.value ?? {}, arg));
    }
    const [head, ...tail] = args;
    const firstNode = new Node(
      this.rules,
      target,
      mock ? NodeType.mock : NodeType.fixture,
      (operation ?? `main`) in ChildType ? ChildType[operation as keyof typeof ChildType] as never : ChildType.main,
      head as never,
      {mainParent: this}
    );
    await awaitStep(`created a node`, firstNode.id);
    created.push(undefined as never);  // filled in at end of function
    // (technically order doesn't matter so end of function could just created.push())
    // (and even if it did matter end of function could just created.shift())
    // (but im happy with this)
    const lastNode = tail.reduce(
      (node: Node, arg) => {
        node.next = new Node(
          this.rules,
          target,
          mock ? NodeType.mock : NodeType.fixture,
          (operation ?? `main`) in ChildType ? ChildType[operation as keyof typeof ChildType] as never : ChildType.main,
          arg as never,
          {mainParent: this, prev: node}
        );
        created.push(node.next);
        return node.next;
      },
      firstNode,
    );
    await awaitStep(`created nodes`, lastNode.id);
    if (this.mainChild === null || this.mainChild.layer !== target) {
      const oldFirstChild = this.firstChild();
      const oldLastChild = oldFirstChild?.lastSibling();
      this.mainChild = new Node(
        this.rules,
        target,
        NodeType.blank,
        ChildType.main,
        undefined,
        {mainParent: this, mainChild: this.mainChild},
      );
      await awaitStep(`created node`, this.mainChild.id);
      let oldChild = oldFirstChild;
      while (oldChild && oldChild !== oldLastChild?.next) {
        oldChild.mainParent = this.mainChild;
        oldChild = oldChild.next;
      }
      created.push(this.mainChild);
    }
    // coalesce was handled at the top of this function
    switch (operation) {
      case `preject`:
        await this.mainChild.preject(firstNode, lastNode);
        // await awaitStep(ter preject`);
        break;
      case `postject`:
        this.mainChild.postject(firstNode, lastNode);
        break;
      default:
        if (await this.mainChild.split(firstNode, lastNode)) {
          created[0] = this.mainChild;
          return created;
        }
    }
    // await awaitStep(`done splitting`);
    created[0] = firstNode;
    return created;
    // this.mainChild.split(firstNode, lastNode);
  }

  async erase() {
    // if (this.mainParent) {
    //   this.mainParent.mainChild = this.prejectBoundary();
    // }
    // if (this.mainParent && this.mainParent.mainChild === this) {
    //   this.mainParent.mainChild = null;
    // }
    // this.mainParent = null;
    // if (this.prev) {
    //   this.prev.next = this.next;
    // }
    // if (this.next) {
    //   this.next.prev = this.prev;
    // }
    // this.prev = null;
    // this.next = null;
    this.erased = true;
    for (const child of this.children()) {
      await child.erase();
    }
  }

  async applyOperation(
    operation: {operation: string, argument: {specs: never, env: never, layer: never}, mock: boolean},
    source: Alphabet,
    target: Alphabet,
    transforming: boolean,
    collectedEnv: {next: Node[], prev: Node[]},
    rule: typeof this.createdBy,
  ): Promise<Array<Node>> {
    // if (operation.operation === `preject` && operation.argument?.[0]?.type !== `affix` || operation.operation === `postject`) {
    //   return false;
    // }
    // // only run same-layer rules when transforming
    // if (transforming && !(operation.operation === `mock` || operation.mock)) {
    //   return false;
    // }
    // // only run next-layer rules when promoting
    // if (!transforming && (operation.operation === `mock` || operation.mock)) {
    //   return false;
    // }
    const created: Array<Node> = [];
    if (operation.operation !== `preject` && operation.operation !== `postject` && this.mainChild !== null && this.mainChild.type !== NodeType.blank) {
      return created;
    }
    if (operation.operation === `coalesce`) {
      this.mainChild = new Node(
        this.rules,
        target,
        NodeType.mock,
        ChildType.coalesce,
        undefined,
        {mainParent: this, mainChild: this.mainChild}
      );
      await awaitStep(`created a node`, this.mainChild.id);
      collectedEnv = operation.argument.env
        ? await this.collectEnv(operation.argument.env)
        : collectedEnv;
      // values of collectedEnv is collectedEnv.next, collectedEnv.prev
      Object.values(collectedEnv).forEach(nodes => nodes.forEach(
        node => {
          node.mainChild?.orphanSiblings();
          node.mainChild = this.mainChild;
        }
      ));
      created.push(this.mainChild);
    }
    // console.log(`operation`, operation);
    created.push(...await this.makeChildren(
      Array.isArray(operation.argument) ? operation.argument : operation.argument.specs,
      operation.operation === `mock` || operation.mock ? source : target,
      operation.operation,
      operation.mock,
    ));
    created.forEach(node => {node.createdBy = rule;});
    await awaitStep(`done making children`, ...created.map(x => x.id));
    return created;
  }

  async applyOneRule(
    rule: typeof this.rules[string][string][number],
    inTransformRules: boolean,
    oddsMap: Map<object, number>,
    envCache: Map<object, {next: Node[], prev: Node[]}>,
    created: Node[],
  ) {
    // if we're here it means specs match!
    // so... bam just do the transformation
    // first skip this rule if the stars aren't aligned
    // (but leave it open for rules that share its odds)
    if (rule.odds.value < 100) {
      if (!oddsMap.has(rule.odds.id)) {
        oddsMap.set(rule.odds.id, Math.random() * 100);
      }
      const result = oddsMap.get(rule.odds.id)!;
      oddsMap.set(rule.odds.id, result - rule.odds.value);
      if (result >= rule.odds.value) {
        // less than means we run the rule so geq means skip
        // but oddsMap guarantees that as long as the diff values add up to 100 then one variant of this rule WILL run
        return;
      }
    }

    // finally if we're here it means we're really running this rule
    const into: ReadonlyArray<object> = (
      rule.into instanceof Function
        ? rule.into(this.value)
        : rule.into
    ).flat(Infinity);

    if (into.length === 0) {
      await this.erase();
      return;
    }

    if (!envCache.has(rule.for)) {
      envCache.set(rule.for, await this.collectEnv(rule.for));
    }

    const specs: object[] = [];
    for (const v of into) {
      // console.log(`????`, v);
      if (`operation` in v && `argument` in v && `mock` in v) {
        if (specs.length) {
          created.push(...await this.applyOperation(
            inTransformRules ? {
              operation: inTransformRules ? `mock` : `promote`,
              argument: {specs: [...specs]},
              mock: inTransformRules,
            } as never : {operation: `promote`, argument: {specs: [...specs]}, mock: false} as never,
            this.layer,
            this.mainChild?.layer ?? this.layer,
            true,
              envCache.get(rule.for)!,
              rule
          ));
        }
        specs.length = 0;
        created.push(...await this.applyOperation(
          inTransformRules ? {
            ...v,
            mock: v.operation === `mock` ? v.mock : true,
          } as never : v as never,
          this.layer,
          this.mainChild?.layer ?? this.layer,
          true,
            envCache.get(rule.for)!,
            rule
        ));
      } else {
        specs.push(v);
      }
    }

    if (specs.length) {
      created.push(...await this.applyOperation(
          {
            operation: inTransformRules ? `mock` : `promote`,
            argument: {specs: [...specs]},
            mock: inTransformRules,
          } as never,
          this.layer,
          this.mainChild?.layer ?? this.layer,
          true,
          envCache.get(rule.for)!,
          rule
      ));
    }
  }

  async applyRules(): Promise<Array<Node>> {
    const created: Array<Node> = [];
    if (this.mainChild === null) {
      return created;
    }

    if (this.mainChild.type !== NodeType.blank) {
      console.error(`not blank bro`, this.mainChild);
    }

    const oddsMap = new Map<Record<string, never>, number>();
    const specsCache = new Map<object, boolean>();
    const envCache = new Map<object, {next: Node[], prev: Node[]}>();

    let inTransformRules = true;
    const rules = [
      ...(this.rules[this.layer.name]?.[this.layer.name] ?? []),
      null,
      ...(this.rules[this.layer.name]?.[this.mainChild.layer.name] ?? []),
    ];

    this.waitingOnTarget = false;
    await this.wipeChildren();

    for (const rule of rules) {
      if (rule === null) {
        inTransformRules = false;
        continue;
      }

      // epenthesis lmao
      const env = await this.isEpenthesis(rule.for);
      if (env) {
        if (this.next === null || this.prev === null) {
          // banking on texts always having a boundary appended at the beginning and (crucially) end
          continue;
        }
        const collectedNext = {next: [], prev: []};
        const collectedPrev = {next: [], prev: []};
        if (
          !(await this.collectEnvSeparate(rule.for, null, collectedNext)).prev
          || !(await this.prev.collectEnvSeparate(rule.for, null, collectedPrev)).next
        ) {
          continue;
        }
        // if (await this.checkEnv({next: collectedNext.next}, null) && await this.next.checkEnv({prev: collectedPrev.prev}, null)) {
        await awaitStep(`epenthesizing`, this.id);
        const oldPrev = this.prev;
        this.prev = new Node(
          this.rules,
          this.layer,
          NodeType.blank,
          ChildType.main,
          null,
          {prev: this.prev, next: this, mainParent: null}
        );
        if (oldPrev) {
          oldPrev.next = this.prev;
        }
        this.prev.createdBy = rule;
        await this.prev.extrudeLeaders(false);
        if (this.prev.mainChild) {
          created.push(this.prev.mainChild);
        }
        await this.prev.applyOneRule(rule, inTransformRules, oddsMap, envCache, created);
        // await debugStep(`created epenthetic node`, this.prev.id);
        // specsCache.set(rule.for, false);
        // }
        continue;
      }

      if (!specsCache.has(rule.for)) {
        specsCache.set(rule.for, await this.checkSpecs(rule.for));
      }
      if (!specsCache.get(rule.for)!) {
        if (this.waitingOnTarget) {
          break;
        }
        continue;
      }

      await this.applyOneRule(rule, inTransformRules, oddsMap, envCache, created);
    }

    return created;
  }
}


function populate(
  rules: Record<string, Record<string, ReadonlyArray<{for: object, into: object, odds: ReturnType<ReturnType<typeof sharedOdds>>}>>>,
  input: ReadonlyArray<{type: string, features: object, context: object}>,
  alphabets: ReadonlyArray<Alphabet>
) {
  /*
  // ugly, either do this outside of this function or at least define this operation more rigorously
  input = [
    {type: `boundary`, features: {type: `pause`}},
    ...input,
    {type: `boundary`, features: {type: `pause`}}
  ];
  */
  const [startAlphabet, ...downstreamers] = alphabets;
  const [initial, ...neighbors] = input;
  const feeder = new Node(rules, startAlphabet, NodeType.fixture, null, initial).usable();
  // populate first layer horizontally
  neighbors.reduce(
    (node, value) => node.next = new Node(rules, startAlphabet, NodeType.fixture, null, value, {prev: node}).usable(),
    feeder,
  );
  // extend all first-layer nodes vertically
  feeder.populateListChildren(downstreamers);
  return feeder;
  // debug
  // const layers = [];
  // let leader = feeder;
  // while (leader !== undefined) {
  //   layers.push([leader.layer.name]);
  //   const original = leader;
  //   while (leader.next) {
  //     layers[layers.length - 1].push(leader as never);
  //     leader = leader.next;
  //   }
  //   leader = original.children[0];
  // }
  // return layers;
}

// import {nextTick} from 'vue';
// const settle = (callback = () => {}) =>
//   new Promise(res =>
//     nextTick(() =>
//       requestAnimationFrame(() => 
//         requestAnimationFrame(() => res(callback())))));
async function run(grid: Node | null) {
  // 1. run all transform rules on entire top row of grid
  // -
  // 2. connect leading nodes to one another to form a new generation
  // 3. for all nodes that were changed, notify their subscribers' leading descendants to rerun rules
  // 4. repeat steps 2-3 until no nodes are marked changed
  // -
  // 5. run all promote rules on entire row of current leaders
  // 6. for all blank nodes on new layer, notify ancestors that are waitingOnTarget to rerun rules
  // 7. repeat steps 5-6 until no blank nodes on new layer
  // -
  // 8. repeat steps 1-7 with the new layer as the 'top row'

  const nodesToChange = new Set<Node>();

  let rip = 0;
  await awaitStep(`Starting`);
  while (grid && rip++ < 20) {
    // populate nodesToChange for transform rules
    let node: Node | null = grid;
    while (node) {
      nodesToChange.add(node);
      node = node.next;
    }
    await awaitStep(`Step 1`);
    console.log(`step 1`);
    do {
      // await awaitStep(`connecting leaders`, grid.seekLeader());
      // await debugStep(`connecting leaders from`, grid.id);
      await grid.connectLeaders();
      // await debugStep(`done connecting leaders`, grid.id);
      await grid.extrudeLeaders();
      await grid.seekLeader().fillInTheBlanks();
      let node: Node | null = grid.seekLeader();
      while (node) {
        if (node.mainChild?.type === NodeType.blank) {
          // await debugStep(`adding child ${node.id} for child ${node.mainChild.id}`, node.id, node.mainChild.id);
          nodesToChange.add(node);
        }
        node = node.next;
      }

      const nodesChanged = new Set<Node>();
      for (const node of nodesToChange) {
        // nodesTouched.add(node);
        const results = await node.applyRules();
        if (results.length > 0) {
          // await debugStep(`adding`, node.id);
          nodesChanged.add(node);
        }
        for (const created of results) {
          created.usableYet = true;
        }
      }
      nodesToChange.clear();

      // await debugStep(`Step 3`);
      console.log(`step 3`, nodesChanged);
      for (const n of nodesChanged) {
        for (const leader of n.leaders()) {
          if (leader !== n) {
            nodesToChange.add(leader);
          }
        }
        for (const subscriber of n.subscribers) {
          for (const leader of subscriber.leaders()) {
            if (leader.type !== NodeType.blank) {
              nodesToChange.add(leader);
            }
          }
        }
      }
    } while (nodesToChange.size > 0);

    await awaitStep(`Step 8`);
    await awaitStep(`${grid.layer.name} -> ${grid.seekLeader().layer.name}`, grid.id, grid.seekLeader().id);
    grid = grid.seekLeader().firstChild();
    // await debugStep(`moving on to ${grid?.layer.name}`, grid?.id ?? -1);
    console.log(`step 8 i think`, rip);
  }
}

window.match = matchers.single.bind(matchers);

window.rules = {};

const grid = populate(
  Object.fromEntries(Object.entries(rulePacks).map(([k, v]) => [
    k,
    Object.fromEntries(Object.entries(v.rulePacks).map(([kk, vv]) => [
      kk,
      window.rules[`${k}-${kk}`] = orderRules(vv, mapToSource(selfProfile, vv.defaults)),
    ])),
  ])) as never,
  input,
  [templates, underlying, phonic]
);

let running = false;
// const test = input[0];
// console.log(`wat`);
// console.log(matchers.single({type: `word`, features: templates.types.word}, {type: `word`, features: {string: [3]}}));

// debug;
// const layers = [];
// let leader = grid;
// while (leader !== undefined) {
//   layers.push([leader.layer.name]);
//   const original = leader;
//   while (leader.next) {
//     layers[layers.length - 1].push(leader as never);
//     leader = leader.next;
//   }
//   leader = original.children()[0];
// }
// console.log(layers);


(window as any).abc = rulePacks;

(window as any).profile = {
  self: selfProfile,
  rassi: rassiProfile,
};

// console.log(withFlags(underlying.types.consonant, `affected`, `weak`));


const speed = ref(250);
const multiplier = ref(1);
</script>

<template>
  <div id="controls">
  <button @click="() => run(grid)">Run</button>
  <button @click="() => { waiting = null; }" :style="waiting ? {backgroundColor: `lightpink`} : {}">Step: {{ waiting }}</button>
  <p><input type="range" id="speed" name="speed" min="1" max="10000" v-model="speed" />
</p><p>
  <input type="range" id="multiplier" name="multiplier" min="0" max="60" v-model="multiplier" />
</p>
  <p>{{ speed * multiplier }}</p>
</div>
  <v-network-graph class="graph" :nodes="nodes" :edges="edges" :configs="configs"></v-network-graph>
</template>

<style scoped>
.err {
  color: red;
}

.graph {
  width: 100vw;
  height: 100vh;
}

#controls {
  position: absolute;
  z-index: 100;
}
</style>
