/* eslint-disable max-classes-per-file */
import {alphabet as abc} from '../../symbols';
import {type as objType} from '../../objects';
import {extractDeps, moldObject, qualifyKeys} from './helpers';
import {misc} from '../../utils';
const {lastOf} = misc;

import {STAY} from './consts';
import match from './match';
import {depType, transformType} from './type';
import weighted from 'weighted';

// see comments above keys() and keys.with()
function makeObjectKeyParser(emptyValue, givenValue = v => v) {
  return function parse(keys, ...values) {
    values.reverse();
    return JSON.parse(keys.map((string, idx) => [
      string
        .replace(/\w+/g, `"$&"`)
        // this should just be a lookbehind thanks safari
        .replace(/[^,{}:](?=[},])/g, `$&: ${emptyValue(values)}`),
      givenValue(values.pop()),
    ]).flat().join(``));
  };
}

// use this as a template-string tag to select specific keys for use with capture
// specifically if you're passing an object that's not of your own definition and
// you don't need the entire thing to be matched
// usage: keys`{bruh: {test}, bruv}` -> {bruh: {test: {}}, bruv: {}}
// - for example, capture.only(symbols.c, Capture.keys`{value}`)
// - is just like capture.only(symbols.c, {value: {}})
// - which equals capture.only({value: symbols.c.value})
// but isn't as redundant, which gets pretty important the more keys you get
// - e.g. capture.only({meta: {features: {something: symbols.e.something, otherThing: symbols.e.otherThing}}})
// - can just be capture.only(symbols.e, Capture.keys`{meta: {features: {something, otherThing}}}`)
// ALSO you can use this to edit specific values of the object in a similar way to obj.edit()
// - e.g. instead of capture.only({value: symbols.w.value, meta: {weak: true, features: {emphatic: true}}})
// - you can also do capture.only(symbols.w, Capture.keys`{value, meta: {weak: ${true}, features: {emphatic: ${true}}}})
// that part is definitely not much of a space-saver and you'll likely end up doing this instead:
// capture.only(symbols.w, Capture.keys`{value}`, Capture.keys.with(true)`{meta: {weak}, features: {emphatic}}`)
// or just:
// capture.only(symbols.w, Capture.keys`{value}`, {meta: {weak: true, features: {emphatic: true}}})
// but having the option to do it in this one function is still nice
export const keys = Object.assign(
  // just an empty match object for when no match is given, signaling to the capture functions that
  // they should match everything for this key
  makeObjectKeyParser(() => `{}`),
  {
    // Capture.keys.with(true)`{meta: {weak, features: {emphatic}}}` => {meta: {weak: true, features: {emphatic: true}}},
    // Capture.keys.with(true, false)`{meta: {weak, features: {emphatic}}` => {meta: {weak: true, features: {emphatic: false}}}
    // Capture.keys.with(true, false)`{meta: {weak: ${1}}, features: {emphatic: ${0}, etc: ${1}}}` => they're indices, you get it
    // overkill? yes
    // having fun tho? heck yes
    with(...options) {
      const poppableOptions = options.slice().reverse();
      return makeObjectKeyParser(
        options.length === 1 ? () => options[0] : () => poppableOptions.pop(),
        idx => options[idx]
      )
    }
  }
);

function copySeg(obj) {
  return {
    type: obj.type,
    meta: {...obj.meta, features: {...(obj.meta ? obj.meta.features : null)} },
    value: obj.value,
    context: {...obj.context},
  };
}

class DefaultObject {
  constructor(obj, newEntry) {
    this.map = obj;
    this.newEntry = newEntry;
  }

  ensure(key) {
    if (this.map[key] === undefined) {
      this.map[key] = this.newEntry(key);
    }
    return this.map[key];
  }

  keys() {
    return Object.keys(this.map);
  }

  values() {
    return Object.values(this.map);
  }

  entries() {
    return Object.entries(this.map);
  }
}

// XXX: this feels like a bad idea bc recursive dependency...
// (TrackerList contains Trackers and Tracker can contain TrackerLists)
class TrackerList {
  constructor(word, rules, layers, minLayer = 0, parent = null) {
    let head = null;
    let last = null;
    for (const segment of word.value) {
      if (head === null) {
        head = last = new Tracker(segment, rules, layers, word.meta, {minLayer, parent: this});
      } else {
        last.next = new Tracker(segment, rules, layers, word.meta, {prev: last, minLayer, parent: this});
        last = last.next;
      }
    }

    this._head = head;
    this._tail = last;

    this.parent = parent;
    this.prev = this.parent && this.parent.prev;
    this.next = this.parent && this.parent.next;
  }

  get head() {
    if (this._head && this._head.node.prev !== null) {
      this._head = this._head.node.prev;
    }
    return this._head;
  }

  get tail() {
    if (this._tail && this._tail.node.next !== null) {
      this._tail = this._tail.node.next;
    }
    return this._tail;
  }

  isEmpty() {
    if ((this.head === null) !== (this.tail === null)) {
      throw new Error(`only one end of this TrackerList is empty`);
    }
    return this.head === null;
  }
}

class TrackerChoices {
  constructor(choices = [], reason = ``, rule = -1, environment = match({}), current = 0) {
    this.choices = choices;
    this.reason = reason;
    this.rule = rule;
    this.environment = environment;
    this.current = current;
  }

  choose(idx) {
    this.current = idx;
  }

  getCurrentChoice() {
    return this.choices[this.current];
  }
}

class TrackerHistory {
  constructor() {
    this.history = [];
    this.current = -1;
  }

  revert(idx) {
    this.current = idx;
  }

  insert(...newHistory) {
    this.history.splice(this.current + 1, this.history.length);
    this.history.push(...newHistory);
    this.current = this.history.length - 1;
  }

  insertOne(choice, ...args) {
    this.insert(new TrackerChoices(choice, ...args));
  }

  choose(idx) {
    if (idx === this.history[this.current].current) {
      this.revert(this.current + 1);
      return false;
    } else {
      this.history[this.current].choose(idx);
      this.insert();
      // caller now has to call this.insert(...) to update
      return true;
    }
  }

  getChoice(idx) {
    return this.history[idx].getCurrentChoice();
  }

  getCurrentChoice() {
    const currentChoices = this.history[this.current];
    return currentChoices && currentChoices.getCurrentChoice();
  }
}

class Tracker {
  static DEP_FILTERS = {
    [depType.prevConsonant]: match({type: objType.consonant}),
    [depType.nextConsonant]: match({type: objType.consonant}),
    [depType.prevVowel]: match({type: objType.vowel}),
    [depType.nextVowel]: match({type: objType.vowel}),
  }

  constructor(segment, rules, layers, wordInfo, {prev = null, next = null, minLayer = 0, parent = null}) {
    this.node = {prev, next};
    this.rules = rules;
    this.wordInfo = wordInfo;
    this.parent = parent;
    this.minLayer = minLayer;

    const layerNames = Object.keys(layers);
    this.layers = layers;
    this.dependents = new DefaultObject({}, () => new Map());

    // update environment/dependencies on demand
    this.environmentCache = layerNames.map(() => ({})); // don't neeeed => Object.fromKeys(deptype...etc) since i just test for undefined lol
    this.environment = layerNames.map(
      (_, layer) => depType.keys.reduce(
        (o, dep) => layer < this.minLayer ? {} : Object.defineProperty(o, dep, {
          get: () => {
            if (this.environmentCache[layer][dep] === undefined) {
              this.environmentCache[layer][dep] = this.findDependency(layer, depType[dep])
            }
            return this.environmentCache[layer][dep];
          }
        }),
        {}
      )
    );

    this.history = layerNames.map(() => new TrackerHistory());
    // insert underlying segment to kick things off
    this.history[this.minLayer].insertOne([segment], `Underlying.`);
  }

  get prev() {
    return this.node.prev || (this.parent && this.parent.prev);
  }

  set prev(item) {
    if (item) {
      item.prev = this.node.prev;
    }
    this.node.prev = item;
  }

  get next() {
    return this.node.next || (this.parent && this.parent.next);
  }

  set next(item) {
    if (item) {
      item.next = this.next;
    }
    this.node.next = item;
  }

  invalidateDependencies(layer, ...keys) {
    keys.forEach(key => {
      this.environmentCache[layer][key] === undefined;
    });
  }

  retrieveDependency(layer, dep) {
    const currentChoice = this.getCurrentChoice(layer);
    if (dep > depType.type && currentChoice instanceof TrackerList) {
      const recurse = tracker => this.findRecursiveDependency(layer, tracker, dep, Tracker.DEP_FILTERS[dep]);
      switch (dep) {
        case depType.prev:
        case depType.prevVowel:
        case depType.prevConsonant:
          return recurse(currentChoice.tail);

        case depType.next:
        case depType.nextVowel:
        case depType.nextConsonant:
          return recurse(currentChoice.head);
      }
    }
    return this.environment[layer][depType.keys[dep]];
  }

  findDependency(layer, dep) {
    const recurse = tracker => this.findRecursiveDependency(layer, tracker, dep, Tracker.DEP_FILTERS[dep]);
    switch (dep) {
      /* constant dependencies */
      case depType.word:
        return this.wordInfo;
      case depType.type:
        return this.getCurrentChoice(layer).type;

      /* reactive dependencies */
      case depType.prev:
      case depType.prevVowel:
      case depType.prevConsonant:
        return recurse(this.prev);

      case depType.next:
      case depType.nextVowel:
      case depType.nextConsonant:
        return recurse(this.next);

      default:
        throw new Error(
          `Unknown dep: ${dep} for ${this} (enum value ${depType.keys[dep]})`
        );
    }
  }

  findRecursiveDependency(layer, neighbor, relationship, constraint) {
    if (!constraint) {
      return this.react(layer, neighbor, relationship);
    }
    if (!neighbor) {
      return null;
    }
    if (neighbor.matches(layer, constraint)) {
      return this.react(layer, neighbor, relationship);
    }
    return this.react(layer, neighbor.retrieveDependency(layer, relationship), relationship);
  }

  react(layer, tracker, relationship) {
    if (!tracker) {
      return {$exists: false};
    }
    // TODO: can do better than just `relationship` now that deps aren't in a black box,
    // use helpers.qualifyKeys() here instead (this will likely help with recognizing
    // infinite recursion)
    tracker.addDependent(layer, this, relationship);
    return {
      ...tracker.getCurrentChoice(layer),
      $deps: tracker.environment[layer],
      $exists: true
    };
  }

  addDependent(layer, tracker, relationship) {
    const dependentsAtLayer = this.dependents.ensure(layer);
    if (!dependentsAtLayer.has(tracker)) {
      dependentsAtLayer.set(tracker, new Set());
    }
    dependentsAtLayer.get(tracker).add(relationship);
  }

  matches(layer, props) {
    const currentChoice = this.getCurrentChoice(layer);
    return !(currentChoice instanceof TrackerList) && props.matches(currentChoice);
  }

  updateChoice(layer, choicesIdx, newChoiceIdx) {
    const history = this.history[layer];
    history.revert(choicesIdx);
    if (history.choose(newChoiceIdx)) {
      this.applyRules(layer);
    }
  }

  applyRules(layer, minIdx = 0) {
    this.rules.matchers.slice(minIdx).forEach((rule, idx) => {
      let value = this.getCurrentChoice(layer);
      if (
        layer === rule.layer
        && rule.value.matches(value)
        && (rule.spec.where === null || rule.spec.where.matches(this.environment[layer]))
      ) {
        switch (rule.do) {
          case transformType.transformation:
            this.transform(layer, idx, rule.spec);
            break;
          case transformType.promotion:
            this.promote(layer, idx, rule.spec);
            layer += 1;
            break;
          case transformType.expansion:
            this.expand(layer, idx, rule.spec);
            layer += 1;
            break;
        }
      }
    });
  }

  reapplyRules(layer) {
    this.history[layer].revert(
      this.history[layer].history.findIndex(
        choices => !choices.environment.matches(this.environment[layer])
      )
    );
    this.applyRules(layer, this.history[layer].getCurrentChoice().rule);
  }

  invalidateDependents(layer) {
    this.dependents.ensure(layer).forEach((relationships, tracker) => {
      tracker.invalidateDependencies(layer, ...relationships);
      tracker.reapplyRules(layer);
    });
  }

  transform(layer, ruleIdx, {into, odds, where: environment, because}) {
    this.history[layer].insertOne(into, because, ruleIdx, environment, weighted(odds));
    this.invalidateDependents(layer);
  }

  promote(layer, ruleIdx, {into, odds, because}) {
    this.history[layer + 1].revert(-1);
    this.history[layer + 1].insertOne(into, because, ruleIdx, environment, weighted(odds));
    this.invalidateDependents(layer);
  }

  expand(layer, ruleIdx, {into, odds, where: environment, because}) {
    this.history[layer + 1].revert(-1);
    this.history[layer + 1].insertOne(
      into.map(seq => new TrackerList(seq, this.rules, this.layers, layer + 1, this)),
      because,
      ruleIdx,
      environment,
      weighted(odds)
    );
    this.invalidateDependents(layer);
  }

  getCurrentChoice(layer) {
    return this.history[layer].getCurrentChoice();
  }
}

class Rules {
  constructor() {
    // this.raw = [];
    this.matchers = [];
  }

  add(rule) {
    // this.raw.push(rule);
    this.matchers.push({
      ...rule,
      value: match(rule.value),
      spec: {
        ...rule.spec,
        where: rule.spec.where && match(rule.spec.where)
      }
    });
  }
}

export class WordManager {
  constructor(word, alphabets) {
    const abcNames = Object.keys(alphabets);
    this.layerIndices = Object.fromEntries(abcNames.map((name, idx) => [name, idx]));
    this.layers = Object.fromEntries(
      // objects preserve insertion order (given non-numerical keys)
      abcNames.map((name, idx, arr) => [
        name,
        {
          alphabet: alphabets[name],
          prev: abcNames[arr[idx - 1]],
          next: abcNames[arr[idx + 1]],
        }
      ])
    );

    this.rules = new Rules();
    this.trackers = new TrackerList(word, this.rules, this.layerIndices);
  }

  addRule(rule) {
    rule = {...rule, spec: {...rule.spec}};
    rule.layer = this.layerIndices[rule.layer];
    if (!rule.spec.where) {
      rule.spec.where = null;
    }
    if (!Array.isArray(rule.spec.into)) {
      rule.spec.odds = Object.fromEntries(
        Object.values(rule.spec.into).map((weight, idx) => [idx, weight])
      );
      rule.spec.into = Object.keys(rule.spec.into);
    } else if (!rule.spec.odds) {
      rule.spec.odds = Object.fromEntries(rule.spec.into.map((_, idx) => [idx, +!idx]));
    } else if (Array.isArray(rule.spec.odds)) {
      rule.spec.odds = Object.fromEntries(rule.spec.odds.map((weight, idx) => [idx, weight]));
    }
    return this.rules.add(rule);
  }

  init() {
    let node = this.trackers.head;
    if (!node) {
      return;
    }
    do {
      node.applyRules(0);
    } while (node = node.next);
  }

  collect(layer) {
    let node = this.trackers.head;
    if (!node) {
      return;
    }
    const arr = [];
    do {
      arr.push(node.getCurrentChoice(layer));
    } while (node = node.next);
    return arr;
  }
}

class CaptureApplier {
  constructor(layer, manager, capturedSpec) {
    this.layer = layer;
    this.manager = manager;
    this.captured = capturedSpec;
  }

  apply(type, spec) {
    this.manager.addRule({
      layer: this.layer,
      value: this.captured,
      do: type,
      spec,
    });
    return this;
  }

  transform(spec) {
    return this.apply(transformType.transformation, spec);
  }

  expand(spec) {
    return this.apply(transformType.expansion, spec);
  }

  promote(spec) {
    return this.apply(transformType.promotion, spec);
  }
}

class Capture {
  constructor(alphabet, alphabetName, manager) {
    this.alphabet = {name: alphabetName, alphabet};
    this.manager = manager;
  }

  between() {
    throw new Error(`capture.between() isn't implemented yet`);
  }

  segment(obj, ...specifiers) {
    return new CaptureApplier(
      this.alphabet.name,
      this.manager,
      moldObject(obj, ...specifiers)
    );
  }

  segmentOfType(type, ...props) {
    return this.segment({}, {type}, ...props);
  }

  consonant(...props) {
    return this.segmentOfType(objType.consonant, ...props);
  }

  vowel(...props) {
    return this.segmentOfType(objType.vowel, ...props);
  }

  epenthetic(...props) {
    return this.segmentOfType(objType.epenthetic, ...props);
  }

  suffix(...props) {
    return this.segmentOfType(objType.suffix, ...props);
  }

  prefix(...props) {
    return this.segmentOfType(objType.prefix, ...props);
  }

  augmentation(...props) {
    return this.segmentOfType(objType.augmentation, ...props);
  }
}

export class Word {
  constructor(wordObj, alphabets) {
    this.word = {
      type: wordObj.type,
      meta: {...wordObj.meta},
      value: wordObj.value.map(copySeg),
      context: [...(wordObj.context || [])],
    }

    this.manager = new WordManager(this.word, alphabets);
    this.capture = Object.fromEntries([
      ...Object.entries(alphabets).map(
        ([name, abc]) => [name, new Capture(abc, name, this.manager)]
      ),
    ]);
    this.abc = alphabets;
  }

  init() {
    this.manager.init();
  }

  collect(layer) {
    return this.manager.collect(layer);
  }
}
