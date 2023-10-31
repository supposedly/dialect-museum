<script setup lang="ts">

import rulePacks from 'src/languages/levantine/rule-packs/north-levantine/';

import {letters} from 'src/languages/levantine/alphabets/underlying';

import * as selfProfile from 'src/languages/levantine/profiles/self';
import * as rassiProfile from 'src/languages/levantine/profiles/salam-el-rassi';
import * as debug from 'src/languages/levantine/profiles/test.debugwhen';
import {type Alphabet} from 'src/lib/alphabet';
import {matchers} from 'src/lib/utils/match';

import {templates, underlying, phonic} from 'src/languages/levantine/alphabets';
import {cp} from 'fs';
import sharedOdds from 'src/lib/rules/odds';

Object.values(rulePacks).forEach(v => Object.values(v.rulePacks).forEach(v => console.log((v))));

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

const input = [
  {
    type: `word`, features: {
      string: [
        letters.affected.consonant.th,
        letters.affected.vowel.i,
        letters.plain.consonant.q,
        letters.plain.affix.f,
      ],
    }, context: {affected: false},
  },
  {type: `boundary`, features: {type: `word`}},
  {
    type: `verb`,
    features: {
      subject: letters.plain.pronoun.mp3.features,
      tam: `past`,
      door: `fa3al`,
      theme: `u`, // doesn't matter here
      root: [
        letters.plain.consonant.k.features,
        letters.plain.consonant.t.features,
        letters.plain.consonant.b.features,
      ],
    },
  },
  {type: `boundary`, features: {type: `word`}},
  {
    type: `verb`,
    features: {
      subject: letters.plain.pronoun.mp3.features,
      tam: `indicative`,
      door: `f3vl`,
      theme: `u`,
      root: [
        letters.plain.consonant.k.features,
        letters.plain.consonant.t.features,
        letters.plain.consonant.b.features,
      ],
    },
  },
];

enum NodeType {
  blank,
  fixture,
  mock,
  prejectee,
  postjectee,
}

class Node {
  public mainParent: Node | null = null;
  public mainChild: Node | null = null;
  public prev: Node | null = null;
  public next: Node | null = null;

  public frozen: boolean = false;

  public subscribers: Set<Node> = new Set();
  public createdBy: {for: unknown, into: unknown, odds: unknown} | null = null;

  constructor(
    public rules: Record<string, Record<string, ReadonlyArray<{for: object, into: object, odds: ReturnType<ReturnType<typeof sharedOdds>>}>>>,
    public layer: Alphabet,
    public type: NodeType,
    public value: {type: string, features: object, context: object} | undefined,
    environment?: {
      mainParent?: Node[`mainParent`],
      mainChild?: Node[`mainChild`],
      prev?: Node[`prev`],
      next?: Node[`next`],
    }
  ) {
    if (environment) {
      Object.entries(environment).forEach(([k, v]) => {
        // @ts-expect-error Assigning to properties (mainParent, mainChild, prev, next) dynamically
        this[k] = v;
      });
    }
    if (this.mainParent !== null) {
      if (!this.next) {
        this.next = this.mainParent.nextCousinOf(this);
      }
      if (!this.prev) {
        this.prev = this.mainParent.prevCousinOf(this);
      }
    }
  }

  /* properties */
  firstSibling() {
    return this.backseek(node => node.mainParent !== this.mainParent)?.next ?? null;
  }

  lastSibling() {
    return this.foreseek(node => node.mainParent !== this.mainParent)?.prev ?? null;
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
    return this.mainParent.backseek(node => node.mainChild !== this)?.next ?? null;
  }

  lastParent() {
    if (this.mainParent === null) {
      return null;
    }
    return this.mainParent.foreseek(node => node.mainChild !== this)?.prev ?? null;
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
  populateList(rules: typeof this.rules, layer: typeof this.layer, type: typeof this.type, value: typeof this.value) {
    if (this.next === null) {
      this.next = new Node(rules, layer, type, value, {prev: this});
    }
    return this.next;
  }

  populateListChildren(target: Alphabet) {
    if (this.next !== null) {
      this.next.populateListChildren(target);
    }
    if (this.mainChild === null) {
      this.mainChild = new Node(
        this.rules,
        target,
        NodeType.blank,
        (
        // propagates boundaries and other shared stuff
        // (this will also get consonants and vowels i think...
        // and because match lib doesn't care about missing properties it
        // may just work out fine??)
          this.value !== undefined
            && this.value.type in target.types
            && matchers.single(target.types[this.value.type], this.value.features)
            ? this.value
            : undefined
        ),
        {mainParent: this},
      );
      return this.mainChild;
    }
    return undefined;
  }

  /** :( */
  orphanSiblings() {
    this.prev = this.firstSibling()?.prev ?? null;
    this.next = this.lastSibling()?.next ?? null;
  }

  wipeChildren() {
    while (this.mainChild !== null && this.mainChild.layer === this.layer) {
      this.mainChild.orphanSiblings();
      this.mainChild = this.mainChild.mainChild;
    }
    if (this.mainChild === null) {
      return;
    }
    this.mainChild.orphanSiblings();
    this.mainChild.type = NodeType.blank;
    this.mainChild.wipeChildren();
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
    this.subscribers.add(node);
  }

  /**
   * Bro! You just posted cringe!
   */
  looseSubscriber(node: Node) {
    this.subscribers.delete(node);
  }

  /* specs stuff */
  checkSpecs(specs: object, subscriber: Node = this): boolean {
    if (`match` in specs && `value` in specs) {
      switch (specs.match) {
        case `all`:
          return (specs.value as ReadonlyArray<object>).every(v => this.checkSpecs(v, subscriber));
        case `any`:
          return (specs.value as ReadonlyArray<object>).some(v => this.checkSpecs(v, subscriber));
        // does a custom match even make sense up at this level?
        // don't think others do at any rate
        default:
          throw new Error(`Unimplemented match for checkSpecs(): ${specs.match}`);
      }
    }
    return Object.entries(specs).every(([k, v]) => {
      switch (k) {
        case `spec`:
          return this.checkSpec(v, subscriber);
        case `env`:
          return this.checkEnv(v, subscriber);
        case `was`:
          return this.checkWas(v, subscriber);
        case `target`:
          return this.checkTarget(v, subscriber);
        default:
          throw new Error(`Unimplemented for checkSpecs(): ${k}`);
      }
    });
  }

  checkSpec(spec: object, subscriber: Node): boolean {
    if (subscriber) {
      this.subscribe(subscriber);
    }
    return matchers.single(spec as never, this.value);
  }

  _checkEnvPrev(env: ReadonlyArray<object>, subscriber: Node, collectedEnv: Record<`next` | `prev`, Array<object | null>>): boolean {
    let node = this.prev;
    let index = -1;

    let checkingArray = false;
    let arrayLengthSoFar = -1;
    let arrayCheckForValue: object | null = null;
    let checkArrayEndAt: ReadonlyArray<number> | -1 = [];
    let stopCheckingArrayAt = Infinity;

    for (const specs of env) {
      while (checkingArray && arrayLengthSoFar <= stopCheckingArrayAt) {
        if (!node?.checkSpecs(arrayCheckForValue!, subscriber)) {
          checkingArray = false;
          if (checkArrayEndAt !== -1 && !(arrayLengthSoFar in checkArrayEndAt)) {
            return false;
          }
        } else {
          node = node?.prev ?? null;
          collectedEnv.prev[index++] = node;
        }
        arrayLengthSoFar += 1;
      }

      if (`match` in specs && specs.match === `array` && `value` in specs) {
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

      if (!node?.checkSpecs(specs, subscriber)) {
        return false;
      }

      node = node?.prev ?? null;
      collectedEnv.prev[index++] = node;
    }
    return true;
  }

  _checkEnvNext(env: ReadonlyArray<object>, subscriber: Node, collectedEnv: Record<`next` | `prev`, Array<object | null>>): boolean {
    let node = this.next;
    let index = -1;

    let checkingArray = false;
    let arrayLengthSoFar = -1;
    let arrayCheckForValue: object | null = null;
    let checkArrayEndAt: ReadonlyArray<number> | -1 = [];
    let stopCheckingArrayAt = Infinity;

    for (const specs of env) {
      while (checkingArray && arrayLengthSoFar <= stopCheckingArrayAt) {
        if (!node?.checkSpecs(arrayCheckForValue!, subscriber)) {
          checkingArray = false;
          if (checkArrayEndAt !== -1 && !(arrayLengthSoFar in checkArrayEndAt)) {
            return false;
          }
        } else {
          node = node?.next ?? null;
          collectedEnv.next[index++] = node;
        }
        arrayLengthSoFar += 1;
      }

      if (`match` in specs && specs.match === `array` && `value` in specs) {
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

      if (!node?.checkSpecs(specs, subscriber)) {
        return false;
      }

      node = node?.next ?? null;
      collectedEnv.next[index++] = node;
    }
    return true;
  }

  checkEnv(env: object, subscriber: Node, collectedEnv: Record<`next` | `prev`, Array<object | null>> = {next: [], prev: []}): boolean {
    if (`match` in env && `value` in env) {
      switch (env.match) {
        case `all`:
          return (env.value as ReadonlyArray<object>).every(v => this.checkEnv(v, subscriber, collectedEnv));
        case `any`:
          return (env.value as ReadonlyArray<object>).some(v => this.checkEnv(v, subscriber, collectedEnv));
        case `custom`:
          // `all` from custom() will have been done already by this point if i'm not wrong
          // which means collectedEnv will be populated fingers crossed
          return (env.value as (arg: unknown) => boolean)(collectedEnv);
        default:
          throw new Error(`Unimplemented match for checkEnv(): ${env.match}`);
      }
    }
    return Object.entries(env).every(([k ,v]) => {
      switch (k) {
        case `next`:
          return this._checkEnvNext(v.flat(Infinity), subscriber, collectedEnv);
        case `prev`:
          return this._checkEnvPrev(v.flat(Infinity), subscriber, collectedEnv);
      }
    });
  }

  // TODO: check against the actual alphabet reference (ie layer: Alphabet, not layerName: string)
  _checkWas(layerName: string, specs: object, subscriber: Node): boolean {
    if (this.layer.name === layerName) {
      if (this.type === NodeType.fixture && this.checkSpecs(specs, subscriber)) {
        return true;
      }
      if (this.mainParent === null || this.mainParent.layer.name !== layerName) {
        return false;
      }
    }
    return this.parents().some(parent => parent._checkWas(layerName, specs, subscriber));
  }

  checkWas(specs: object, subscriber: Node): boolean {
    if (`match` in specs && `value` in specs) {
      switch (specs.match) {
        case `all`:
          return (specs.value as ReadonlyArray<object>).every(v => this.checkWas(v, subscriber));
        case `any`:
          return (specs.value as ReadonlyArray<object>).some(v => this.checkWas(v, subscriber));
        default:
          throw new Error(`Unimplemented match for checkWas(): ${specs.match}`);
      }
    }
    return Object.entries(specs).every(([k, v]) => this._checkWas(k, v, subscriber));
  }

  // this should only ever be called on the leading node
  // so i think .mainChild should always be the next layer's first node
  // and you don't need to seek for it or anything
  checkTarget(specs: object, subscriber: Node): boolean {
    if (this.mainChild === null) {
      // i think the type system ensures that you can't (type-safely) use target on the bottom layer
      console.error(
        `i was wrong about the type system ensuring that you can't (type-safely) use target on the bottom layer`,
        specs,
      );
      return false;
    }
    if (this.mainChild.type === NodeType.blank) {
      this.frozen = true;
    }
    // this subscribes to mainChild and/or its neighbors in the process
    // i don't even think it needs a special case for mainChild.type === NodeType.blank vs otherwise,
    // this should just work lol
    return this.mainChild.checkSpecs(specs);
  }

  /* transformation stuff */
  applyOperation(operation: {operation: string, argument: object}, target: Alphabet) {
    switch (operation.operation) {
      case `mock`:
        // split child
        return;
      case `preject`:
        // preject a type:preject node right before the last !type:preject child
        return;
      case `postject`:
        // postject a type:postject node right after the last !type:postject child
        return;
      case `coalesce`:
        // call checkEnv with an object defined out here for collectEnv,
        // make every 
        return;
    }
  }

  applyRules(rules: Record<string, Record<string, ReadonlyArray<{for: object, into: object, odds: ReturnType<ReturnType<typeof sharedOdds>>}>>>) {
    const oddsMap = new Map<Record<string, never>, number>();
    const specsCache = new Map<object, boolean>;
    // first run rules from this layer to this layer
    for (const rule of rules[this.layer.name]?.[this.layer.name] ?? []) {
      if (!specsCache.has(rule.for)) {
        specsCache.set(rule.for, this.checkSpecs(rule.for));
      }
      if (!specsCache.get(rule.for)!) {
        if (this.frozen) {
          // means we're waiting on target so we can't do anything
          // hopefully nonmatching specs will short-circuit before reaching target tho :/
          // (hopefully if "insertion order is guaranteed" means it's also guaranteed for literals then
          // i can get away with just a warning about always putting target last in specs)
          break;
        }
        continue;
      }

      // but if we're here it means specs match!
      // so... bam just do the transformation

      if (this.frozen) {
        this.frozen = false;
      }

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
          continue;
        }
      }

      this.wipeChildren();
      const into: ReadonlyArray<object> = (rule.into instanceof Function ? rule.into(this.value) : rule.into).flat(Infinity);
      into.forEach(
        v => this.applyOperation(
          `operation` in v
            ? {
              operation: v.operation as string,
              argument: v.operation === `coalesce`
                ? {specs: {operation: `mock`, argument: v.specs}, env: v.env}
                : v,
            } as never
            : {operation: `mock`, argument: v},
          this.layer
        )
      );
    }


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
  const feeder = new Node(rules, startAlphabet, NodeType.fixture, initial);
  // populate first layer horizontally
  neighbors.reduce(
    (node, value) => node.populateList(rules, startAlphabet, NodeType.fixture, value),
    feeder,
  );
  // extend all first-layer nodes vertically
  downstreamers.reduce(
    (list, alphabet) => list.populateListChildren(alphabet)!,
    feeder,
  );
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

const list = populate(
  Object.fromEntries(Object.entries(rulePacks).map(([k, v]) => [
    k,
    Object.fromEntries(Object.entries(v.rulePacks).map(([kk, vv]) => [
      kk,
      orderRules(vv, mapToSource(selfProfile, vv.defaults)),
    ])),
  ])) as never,
  // @ts-expect-error The boundaries I put in the test input don't have context
  input,
  [templates, underlying, phonic]
);


(window as any).abc = rulePacks;

(window as any).profile = {
  self: selfProfile,
  rassi: rassiProfile,
};


</script>

<style scoped>
.err {
  color: red;
}
</style>
