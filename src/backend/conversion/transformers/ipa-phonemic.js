/* eslint-disable max-classes-per-file */
const symbols = require(`../symbols`);
const {type: objType} = require(`../objects`);
const {fenum} = require(`../enums`);
const {misc: {lastOf}} = require(`../utils`);

// fill an alphabet out with default values n stuff
function makeAlphabet(alphabet) {
  return alphabet;
}

class Transformer {
  constructor(alphabet) {
    this.alphabet = makeAlphabet(alphabet);
  }

  get(keys) {
    let obj = this.alphabet;
    // ugly loop, have to avoid for..of bc of lint reasons that i don't understand xd
    // at least it's fast tho
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (obj[key]) {
        obj = obj[key];
      } else {
        obj = obj.default;
        break;
      }
    }
  }
}

function copySeg(obj) {
  return {
    type: obj.type,
    meta: {...obj.meta},
    value: obj.value,
    context: {...obj.context},
  };
}

class Word {
  constructor(wordObj, augmentationChoice = 0, prefixChoice = 0) {
    const type = wordObj.type;
    const meta = {...wordObj.meta, stemStarts: 0};
    const value = wordObj.value.map(copySeg);
    const context = [...wordObj.context];

    if (meta.prefixes) {
      meta.syllableCount += meta.prefixes[prefixChoice].length;
      const choice = meta.prefixes[prefixChoice].flat();
      meta.prefixChoice = prefixChoice;
      meta.stemStarts = choice.length;
      value.unshift(...choice);
    }

    meta.stemEnds = value.length - 1;

    if (meta.augmentation) {
      meta.augmentationChoice = augmentationChoice;
      const augmentation = meta.augmentation[augmentationChoice];
      if (augmentation.stress) {
        const inefficientVowelCopyLol = value.filter(seg => seg.type === objType.vowel);
        inefficientVowelCopyLol.forEach(vowel => {
          vowel.meta.stressed = false;
        });
        lastOf(inefficientVowelCopyLol).meta.stressed = true;
      }
      value.push(augmentation.string);
    }

    this.type = type;
    this.meta = meta;
    this.value = value;
    this.context = context;
  }
}

const subAlphabets = Object.fromKeys(
  Object.values(objType).map(
    type => [type, Object.values(symbols.alphabet).filter(v => v.type === type)]
  )
);

class Not {
  constructor(value) {
    this.value = value;
  }

  matches(other) {
    // eslint-disable-next-line no-use-before-define
    if (this.value instanceof Or || this.value instanceof Not) {
      return this.value.matches(other);
    }
    return this.value !== other;
  }
}

class Or {
  constructor(...values) {
    this.values = values;
  }

  matches(other) {
    return this.values.some(value => {
      if (value instanceof Not || value instanceof Or) {
        return value.matches(other);
      }
      return value === other;
    });
  }
}

class Props {
  constructor(...objs) {
    if (objs === undefined || objs === null) {
      objs = [];
    }
    this.objs = objs.map(obj => {
      const objCopy = {...obj};
      Object.entries(objCopy).forEach(([k, v]) => {
        if (
          !(v instanceof Props || v instanceof Not || v instanceof Or)
          && v instanceof Object
          && !Array.isArray(v)
        ) {
          objCopy[k] = new Props(v);
        }
      });
      return objCopy;
    });
    this.empty = this.objs.length === 0;
  }

  matches(other) {
    if (this.empty) {
      return true;
    }
    return this.objs.some(
      obj => Object.entries(obj).every(([k, v]) => {
        if (Object.prototype.hasOwnProperty.call(other, k)) {
          if (v instanceof Props || v instanceof Not || v instanceof Or) {
            return v.matches(other[k]);
          }
          return v === other[k];
        }
        return false;
      })
    );
  }

  or(other) {
    return new Props(...this.objs, ...other.objs);
  }
}

const consonantPred = new Props({type: objType.consonant});
const vowelPred = new Props({type: objType.vowel}).or({type: objType.suffix, meta: {t: false}, value: `fem`});

const depType = fenum([
  /* filters */
  `isPrefix`,
  `isAugmentation`,
  /* constant dependencies */
  `idx`,
  `type`,
  `meta`,
  `wordType`,
  `wordMeta`,
  `wordContext`,
  `word`,
  /* reactive dependencies */
  `prevConsonant`,
  `nextConsonant`,
  `prevVowel`,
  `nextVowel`,
]);

function extractDeps(arrowFunc) {
  if (!arrowFunc) {
    return null;
  }
  const [s] = String(arrowFunc).split(`=>`, 1);
  return [...s.matchAll(/(\w+)(?:\s*:\s*\w+)?/g)].map(match => match[1]);
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

const STAY = {};
const NOTHING = {};

class Cap {
  constructor(word) {
    this.word = {...word};
    const segments = new DefaultObject({}, () => new Set());
    word.value.forEach(({value: segment}, idx) => {
      segments.ensure(segment).add(idx);
    });
    this.wordMap = segments;

    this.globalHandlerID = 0;
    this.handlerMap = new DefaultObject(
      Object.fromEntries(this.wordMap.keys().map(k => [k])),
      () => [],
    );

    this.trackers = this.word.map(seg => ({
      visible: true,
      environment: null,
      currentlyInvalidating: false,
      dependents: new DefaultObject(
        {},
        () => new Set(),
      ),
      currentChoiceIndices: [],
      choices: [],
      original: copySeg(seg),
    }));
  }

  // run all handlers again, mutating both word[idx] and
  // trackers[idx].choices + trackers[idx].currentChoiceIndices
  rerunAllHandlers(idx, from) {
    const tracker = this.trackers[idx];
    const originalChoice = from > -1
      ? tracker.choices[from][tracker.currentChoiceIndices[from]]
      : {order: -1};
    tracker.choices.splice(from + 1);
    tracker.currentChoiceIndices.splice(from + 1);

    let changed = false;
    let update = STAY;

    // loop forever (why does eslint like this syntax more than while true lol)
    for (;;) {
      const handlers = this.handlerMap.ensure(this.word[idx].value);
      const current = new Props(this.word[idx]);
      let keepLooping = false;

      const first = handlers.findIndex(
        h => h.order > originalChoice.order
      );

      for (
        let i = first === -1 ? handlers.length : first;
        i < handlers.length;
        i += 1
      ) {
        update = handlers[i].f(idx);
        if (update !== STAY) {
          tracker.choices.push({order: handlers[i].order, arr: update});
          tracker.currentChoiceIndices.push(0);
          // first update the segment in this.word
          this.word[idx] = update[0];
          // if that handler returned a new kind of segment, we also have to
          // start over with that segment's handlers
          if (!current.matches(update[0])) {
            changed = true;
            // this is here to avoid using a labeled loop per eslint,
            // altho honestly i find it a bit more confusing this way
            keepLooping = true;
            break;
          }
        }
      }

      // if we've run thru all the handlers for this segment without it
      // changing, we can leave
      if (!keepLooping) {
        if (update !== STAY) {
          this.word[idx] = update;
        }
        break;
      }
    }

    return changed;
  }

  // call this when the user toggles a choice via the frontend
  // but only AFTER all handlers have already been collected & used once via this.wrap() ofc
  update(idx, choicesIdx, newChoiceIdx) {
    const tracker = this.trackers[idx];
    tracker.currentChoiceIndices[choicesIdx] = newChoiceIdx;
    // delete the index from the now-outdated segment in the wordmap
    this.wordMap.ensure(this.word[idx].value).delete(idx);
    // revert the segment in this.word to that choice for the handlers to operate on
    this.word[idx] = tracker.choices[choicesIdx].arr[newChoiceIdx];
    // put the index in the now-correct segment's entry in the wordmap
    this.wordMap.ensure(this.word[idx].value).add(idx);
    this.rerunAllHandlers(idx, choicesIdx);
    // since the value was updated, it's now invalid for all of its dependents
    tracker.dependents.entries().forEach(([depIdx, relationships]) => {
      this.invalidateDependencies(depIdx, relationships);
    });
  }

  // this is called from this.update() and from itself, signalling to the
  // segment at `idx` that its `deps` have changed and are now invalid
  // meaning it needs to be recomputed with their new values
  invalidateDependencies(idx, deps) {
    const tracker = this.trackers[idx];
    if (tracker.currentlyInvalidating) {
      return;
    }
    // IMPORTANT: this stops infinite recursion
    tracker.currentlyInvalidating = true;
    tracker.choices.clear();
    tracker.currentChoiceIndices.clear();
    // delete idx from outdated wordmap segment
    this.wordMap.ensure(this.word[idx].value).delete(idx);
    // revert the segment in this.word so that the handlers can do it all over again
    this.word[idx] = copySeg(tracker.original);
    // put idx in new wordmap segment
    this.wordMap.ensure(this.word[idx].value).add(idx);
    deps.forEach(key => {
      const depIdx = tracker.environment[key];
      this.trackers[depIdx].dependents.delete(idx);
      delete tracker.environment[key];
    });
    // TODO: could maybe make this more efficient by figuring out a way to only
    // rerun from the first handler that uses one of the invalidated deps
    if (this.rerunAllHandlers(idx, -1)) {
    // if this one changed, then invalidate it for all of its dependents too
      tracker.dependents.entries().forEach(([depIdx, relationships]) => {
        this.invalidateDependencies(depIdx, relationships);
      });
    }
    // IMPORTANT: this ensures that "this stops infinite recursion" works properly
    tracker.currentlyInvalidating = false;
  }

  searchSegmentRight(idx, props) {
    for (let i = idx + 1; i < this.word.length; i += 1) {
      if (props.matches(this.word[i])) {
        return i;
      }
    }
    return null;
  }

  searchSegmentLeft(idx, props) {
    for (let i = idx - 1; i >= 0; i -= 1) {
      if (props.matches(this.word[i])) {
        return i;
      }
    }
    return null;
  }

  react(idx) {
    const tracker = this.trackers[idx];
    return (dep, relationship) => {
      tracker.dependents.ensure(dep).add(relationship);
      return dep;
    };
  }

  depGetter(idx) {
    const react = this.react(idx);
    return key => {
      switch (key) {
        /* filters */
        case depType.isPrefix:
          return idx < this.word.meta.stemStarts;
        case depType.isAugmentation:
          return idx > this.word.meta.stemEnds;
        /* constant dependencies */
        case depType.idx:
          return idx;
        case depType.type:
          return this.word[idx].type;
        case depType.meta:
          return this.word[idx].meta;
        case depType.wordType:
          return this.word.type;
        case depType.wordMeta:
          return this.word.meta;
        case depType.wordContext:
          return this.word.context;
        case depType.word:
          return this.word.value;
        /* reactive dependencies */
        case depType.prevConsonant:
          return react(
            this.searchSegmentRight(idx, consonantPred),
            depType.prevConsonant
          );
        case depType.nextConsonant:
          return react(
            this.searchSegmentLeft(idx, consonantPred),
            depType.nextConsonant
          );
        case depType.prevVowel:
          return react(
            this.searchSegmentRight(idx, vowelPred),
            depType.prevVowel
          );
        case depType.nextVowel:
          return react(
            this.searchSegmentRight(idx, vowelPred),
            depType.nextVowel
          );
        default:
          throw new Error(
            `Unknown dep: ${key} for ${idx}, ${this.word[idx]} (enum value ${depType.keys[key]})`
          );
      }
    };
  }

  updateEnv(
    idx,
    dep
  ) {
    const tracker = this.trackers[idx];
    if (tracker.environment === null) {
      tracker.environment = {};
    }

    const getDependency = this.depGetter(idx);
    dep.forEach(key => {
      if (tracker.environment[key] === undefined) {
        const dependency = getDependency(key);
        tracker.environment[key] = dependency;
      }
    });

    return tracker.environment;
  }

  wrap(results) {
    return handler => {
      const deps = extractDeps(handler);
      results.forEach(idx => {
        const tracker = this.trackers[idx];
        const update = handler(this.updateEnv(idx, deps));
        if (update === STAY) {
          return;
        }
        tracker.choices.push({order: this.globalHandlerID, arr: update});
        tracker.currentChoiceIndices.push(0);
        this.word[idx] = update[0];
        this.handlerMap
          .ensure(this.word[idx].value)
          // TODO: maybe cache this func idk since it doesn't have to worry abt being mutated
          .add({
            order: this.globalHandlerID,
            f: index => handler(this.updateEnv(index, deps)),
          });
        this.globalHandlerID += 1;
      });
    };
  }

  just(obj) {
    return this.wrap(this.wordMap.ensure(obj.value));
  }

  segment(props) {
    props = props instanceof Props ? props : new Props(props);
    return this.wrap(
      this.wordMap.values()
        .map(indices => [...indices].filter(id => props.matches(id.value)))
        .flat()
    );
  }

  segmentOfType(type, props) {
    props = props instanceof Props ? props : new Props(props);
    // don't think i'll allow type or value to be set
    const {meta: {intrinsic, ...rawMeta}} = props.obj;
    const meta = new Props(rawMeta);
    const searchSpace = props && intrinsic
      ? subAlphabets[type].filter(c => intrinsic.matches(c.meta.intrinsic))
      : subAlphabets[type];
    return this.wrap(
      searchSpace
        .map(this.wordMap.ensure)
        .map(indices => [...indices].filter(
          id => meta.matches(id.value.meta)
        ))
        .flat()
    );
  }

  consonant(props) {
    return this.segmentOfType(objType.consonant, props);
  }

  vowel(props) {
    return this.segmentOfType(objType.vowel, props);
  }

  epenthetic(props) {
    return this.segmentOfType(objType.epenthetic, props);
  }

  suffix(props) {
    return this.segmentOfType(objType.suffix, props);
  }
}

/*
needs some way of separating "become this underlying internal thing-eme"
from "become this surface form"
e.g. يضطر should have the ض "become" [ظ ض] (after a rule that
turns ظ into [ظ z*], not before), then have the ض variant be transformed by
a rule that optionally turns (voiced consonant)(unvoiced with same articulator & manner)
into a geminate
but both of those are underlying internal transformations, and the surface choice
should only come after all that
*/

const rules = [
  [_.c, (abc, ctx, {previousVowel, previousConsonant}) => {
    if (ctx.femA) {
      return [abc.c.low];
    }
    if (previousConsonant.value === `r` && previousVowel.meta.intrinsic.ly.high && !previousVowel.meta.intrinsic.ly.rounded) {
      return [abc.c.high];
    }
    if (previousConsonant.meta.intrinsic.ly.emphatic || previousConsonant.value === `r`) {
      // maybe emphatics can sometimes have -e idk
      return [abc.c.low];
    }
    if (ctx.type === `participle`) {
      return [abc.c.high, abc.c.low];
    }
    return [abc.c.high];
  }],
  [_.i, (abc, ctx, {previousConsonant, nextConsonant, codaConsonant}) => {
    // f*** this makes no sense
  }]
];

module.exports = {
  rules,
};
